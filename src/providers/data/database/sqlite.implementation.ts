import {
    ErrorHandler,
    Inject,
    Injectable
} from "@angular/core";
import {PLATFORM_READY} from "../../../app/app.tokens";
import {
    SQLite,
    SQLiteObject
} from "@ionic-native/sqlite";

export abstract class DB {

    /**
     * @param executor callback to execute transaction statements in
     * @return {Promise<T>} returns result of call to executor
     */
    abstract transaction<T>(executor: (tx: DBTransaction) => T|Promise<T>): Promise<T>;

    abstract ready(): Promise<any>;
}

export abstract class DBTransaction {
    abstract executeSql(statement: string, params: any): Promise<DBResultSet>;
}

export function rowsAsArray(data:DBResultSet):any[] {
    let arr = [];
    for (let i = 0; i < data.rows.length; i++) arr.push(data.rows.item(i))
    return arr;
}

export interface DBResultSet extends SQLResultSet {
}

@Injectable()
export class NativeDB extends DB {
    private db: SQLiteObject;
    private connectPromise: Promise<any>;

    constructor(private sqlite: SQLite,
                private errorHandler: ErrorHandler,
                @Inject(PLATFORM_READY) ready: Promise<void>) {
        super();
        // log in cordova invokes toString - [Object object] is not informative enough. JSON.stringify can help a little
        let _log = console.log;
        console.log = (message?: any, ...optionalParams: any[]) => _log("Formaggiore log: "+JSON.stringify(message), ...optionalParams);

        this.connectPromise = ready.then(() => this.connect());
    }

    private connect() {
        return this.sqlite.create({
            name: 'main.db',
            location: 'default'
        })
            .then(database => this.db = database)
            .catch(error =>
                this.errorHandler.handleError("Error while creating database structure\n" + JSON.stringify(error))
            );
    }

    ready(): Promise<any> {
        return this.connectPromise;
    }

    private _tx: Promise<any>;

    transaction(executor: (tx: DBTransaction) => any): Promise<any> {
        this._tx = (this._tx || Promise.resolve())
            .then(() => this._transaction(executor))
            .catch(error => {
                this._tx = null;
                return error;
            });
        return this._tx;
    }

    private _transaction(executor: (tx: DBTransaction) => any): Promise<any> {
        return Promise.resolve()
            .then(() => this.db.executeSql(`BEGIN TRANSACTION`, []))
            .then(() => executor(this.db))
            .then(data => this.db.executeSql(`COMMIT `, [])
                .then(() => data))
            .catch(error => {
                console.log("Rolling back.");
                console.log(error);
                //return this.db.executeSql(`ROLLBACK`, [])
                //    .then(() => Promise.reject(error));
                return Promise.reject(error);
            });
    }

}

@Injectable()
export class WebDB extends DB {

    private db: Database;
    private intransaction: boolean;

    constructor() {
        super();
        this.db = window.openDatabase('maindb', '1.0', 'Formaggiore DB', 2 * 1024 * 1024);
    }

    ready(): Promise<any> {
        return this.db ? Promise.resolve() : Promise.reject('Something wrong, no DB opened!');
    }

    private _tx: Promise<any>;

    transaction(executor: (tx: DBTransaction) => any): Promise<any> {
        let tx = (this._tx || Promise.resolve())
            .then(() => this._transaction(executor));
        this._tx= tx
            .catch(error => {
                this._tx = null;
                return error;
            });

        return tx;
    }

    private _transaction(executor: (tx: DBTransaction) => any): Promise<any> {


        if (this.intransaction) console.warn('You started transaction within a transaction. ' +
            'This might not work on real device.');
        this.intransaction = true;
        let result, error;
        return new Promise((resolve, reject) =>
            this.db.transaction(
                tx => executor(this.wrap(tx))
                    .then(data => result = data)
                    .catch(e => error = e),
                (error) => {
                    this.intransaction = false;
                    reject(error);
                },
                () => {
                    this.intransaction = false;
                    error ? reject(error) : resolve(result);
                })
        );
    }

    wrap(tx: SQLTransaction): DBTransaction {
        return {
            executeSql: (statement: string, params: any) => {
                return new Promise((resolve, reject) => {
                    tx.executeSql(statement, params,
                        (t, result) => resolve(result),
                        (t, error) => {
                            reject(error);
                            return false;
                        });
                });
            }
        };
    }
}
