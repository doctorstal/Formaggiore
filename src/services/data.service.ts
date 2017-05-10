import {
    ErrorHandler,
    Inject,
    Injectable
} from "@angular/core";
import {
    SQLite,
    SQLiteDatabaseConfig,
    SQLiteObject
} from "@ionic-native/sqlite";
import {dbUpgradeList} from "./db.upgrade.list";
import {PLATFORM_READY} from "../app/app.tokens";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/mergeMap";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";

export abstract class DataService {
    protected session: Subject<Session> = new BehaviorSubject({userId: "test"});
    protected recipes: Subject<Recipe[]> = new BehaviorSubject([]);
    session$: Observable<Session> = this.session.asObservable();
    recipes$: Observable<Recipe[]> = this.recipes.asObservable();

    login(credentials: { email: string; password: string }): Observable<boolean> {
        return Observable.create(observable=>{
            this.session.next({userId: "test"});
            observable.next(true);
            observable.complete();
        });
    }

    logout(): Observable<true> {
        return Observable.create(observable => {
            this.session.next(null);
            observable.next(true);
            observable.complete();
        });
    }

    getUser(res: Session): Observable<User> {
        return Observable.of((res != null) ? {email: "test", name: "test"} : null);
    }

    createUser(credentials: { email: string, password: string }): Observable<boolean> {
        return Observable.create(observer => {
            observer.next(true);
            observer.complete();
        })
    }

    createRecipe(recipe: Recipe): Observable<boolean> {
        return Observable.of(true);
    }
}
export interface Recipe {
    name: string;
    description: string;
    steps?: Step[];
}
interface Step {
    // TODO
}
interface Session {
    userId: string;
}

export class User {
    name: string;
    email: string;
}

@Injectable()
export class DataServiceImpl extends DataService {
    private static readonly DATABASE_CONFIG: SQLiteDatabaseConfig = {
        name: 'main.db',
        location: 'default'
    };
    private database: SQLiteObject;

    constructor(private sqlite: SQLite, private errorHandler: ErrorHandler, @Inject(PLATFORM_READY) ready: Promise<void>) {
        super();
        ready
            .then(() => this.connect())
            .then(database => this.updateTablesStructure(database))
            .catch(error => {
                errorHandler.handleError("Error while creating database structure\n" + JSON.stringify(error));
            });
    }


    private connect(): Promise<SQLiteObject> {
        return this.sqlite.create(DataServiceImpl.DATABASE_CONFIG)
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




