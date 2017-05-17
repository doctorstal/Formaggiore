import {
    ErrorHandler,
    Inject,
    Injectable
} from "@angular/core";
import {
    SQLite,
    SQLiteObject
} from "@ionic-native/sqlite";
import {dbUpgradeList} from "./db.upgrade.list";
import {PLATFORM_READY} from "../../app/app.tokens";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/mergeMap";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";
import {
    Credentials,
    Recipe,
    Session,
    User
} from "./datatypes";
import {Md5} from "ts-md5/dist/md5";

@Injectable()
export abstract class DataService {
    protected session: Subject<Session> = new BehaviorSubject(null);
    protected recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject([]);
    session$: Observable<Session> = this.session.asObservable();
    recipes$: Observable<Recipe[]> = this.recipes.asObservable();

    abstract login(credentials: Credentials): Observable<boolean>;

    abstract logout(): Observable<true>;

    abstract getUser(res: Session): Observable<User>;

    abstract createUser(credentials: Credentials): Observable<boolean>;

    abstract createRecipe(recipe: Recipe): Observable<boolean>;
}



export class DataServiceImpl extends DataService {

    constructor(private sqlite: SQLite,
                private errorHandler: ErrorHandler,
                @Inject(PLATFORM_READY) ready: Promise<void>) {
        super();
        ready
            .then(() => this.connect())
            .then(database => this.updateTablesStructure(database))
            .catch(error => {
                errorHandler.handleError("Error while creating database structure\n" + JSON.stringify(error));
            });
    }

    login(credentials: Credentials): Observable<boolean> {
        return Observable.fromPromise(
            this.database.executeSql(`SELECT id
                                      FROM users
                                      WHERE login = ? AND password_hash = ?`,
                [credentials.email, this.getPassHash(credentials)])
                .then(data => {
                    if (data.length > 0) {
                        this.session.next({userId: data.rows.item(1).id});
                        return true;
                    }
                    this.session.next(null);
                    return false;
                })
        );
    }

    private getPassHash(credentials:Credentials): string {
        return <string>Md5.hashStr(credentials.login + credentials.password);
    }

    logout(): Observable<true> {
        return Observable.create(observable => {
            this.session.next(null);
            observable.next(true);
            observable.complete();
        });
    }

    getUser(res: Session): Observable<User> {
        return Observable.fromPromise(
            this.database.executeSql(`SELECT
                                        name,
                                        login
                                      FROM users
                                      WHERE id == ?`, [res.userId])
                .then(data => {
                    if (data.length > 0) {
                        let item = data.rows.item(0);
                        return new User(item.name, item.login);
                    } else {
                        return Promise.reject('No such user!');
                    }
                })
        );
    }

    createUser(credentials:Credentials): Observable<boolean> {
        // TODO create default user in db.upgrade.scripte
        this.database.executeSql(`
          INSERT INTO users (name, login, password_hash) VALUES (?, ?, ?)
        `, [credentials.name, credentials.login, this.getPassHash(credentials)])
            .then(() => this.database.executeSql(`
              INSERT INTO userData (user_id, email) SELECT
                                                      id,
                                                      ?
                                                    FROM users
                                                    WHERE login = ?
            `, [credentials.email, credentials.login]));


        return Observable.fromPromise(
            this.database.executeSql(`INSERT INTO users (email, password_hash)
            VALUES (?, ?)`, [credentials.email, credentials.password])
                .then(data => (data.rowsAffected == 1))
        );
    }

    createRecipe(recipe: Recipe): Observable<boolean> {
        return Observable.of(true);
    }

    private database: SQLiteObject;


    private connect(): Promise<SQLiteObject> {
        return this.sqlite.create({
        name: 'main.db',
        location: 'default'
    })
            .then(database => this.setDatabase(database))
    }

    private setDatabase(database: SQLiteObject): Promise<SQLiteObject> {
        this.database = database;
        return Promise.resolve(database);
    }

    private updateTablesStructure(database: SQLiteObject): Promise<SQLiteObject> {
        return dbUpgradeList.upgrade(database);
    }
}




