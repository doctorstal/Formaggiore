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
    abstract transaction(executor: (tx: DBTransaction) => any): Promise<any>;
    abstract ready(): Promise<any>;
}

export abstract class DBTransaction {
    abstract executeSql(statement: string, params: any): Promise<any>;
}

@Injectable()
export class NativeDB extends DB {
    private db: SQLiteObject;
    private connectPromise: Promise<any>;

    constructor(private sqlite: SQLite,
                private errorHandler: ErrorHandler,
                @Inject(PLATFORM_READY) ready: Promise<void>) {
        super();
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

    transaction(executor: (tx: DBTransaction) => any): Promise<any> {
        return Promise.resolve()
            .then(() => this.db.executeSql(`BEGIN TRANSACTION`, []))
            .then(() => executor(this.db))
            .then(() => this.db.executeSql(`COMMIT `, []));
    }

}

@Injectable()
export class WebDB extends DB {

    private db: Database;

    constructor() {
        super();
        this.db = window.openDatabase('maindb', '1.0', 'Formaggiore DB', 2 * 1024 * 1024);
    }

    ready(): Promise<any> {
        return this.db ? Promise.resolve() : Promise.reject("Something wrong, no DB opened!");
    }

    transaction(executor: (tx: DBTransaction) => any): Promise<any> {
        return new Promise((resolve, reject) =>
            this.db.transaction(tx => executor(this.wrap(tx)), reject, resolve));
    }

    wrap(tx: SQLTransaction): DBTransaction {
        return {
            executeSql: (statement: string, params: any) => {
                let promise = new Promise((resolve, reject) => {
                    tx.executeSql(statement, params,
                        (t, result) => resolve(result),
                        (t, error) => {
                            reject(error);
                            return true;
                        });
                });
                return promise;
            }
        };
    }
}
