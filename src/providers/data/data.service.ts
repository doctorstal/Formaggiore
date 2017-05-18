import {
    ErrorHandler,
    Injectable
} from "@angular/core";
import {dbUpgradeList} from "./db.upgrade.list";
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
import {DB} from "./database/sqlite.implementation";

@Injectable()
export class DataService {
    protected session: Subject<Session> = new BehaviorSubject(null);
    protected recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject([]);
    session$: Observable<Session> = this.session.asObservable();
    recipes$: Observable<Recipe[]> = this.recipes.asObservable();

    constructor(private db: DB,
                private errorHandler: ErrorHandler) {
        db.ready()
            .then(() => this.updateTablesStructure())
            .catch(error => {
                console.log(error);
                errorHandler.handleError("Error while creating database structure\n" + JSON.stringify(error));
            });
    }

    login(credentials: Credentials): Observable<boolean> {
        // TODO we should actually create session in DB
        return Observable.create(observer =>
            this.db.transaction(tx =>
                tx.executeSql(`SELECT id
                               FROM users
                               WHERE login = ? AND password_hash = ?`,
                    [credentials.login, this.getPassHash(credentials)])
                    .then(data => {
                        console.log(data);
                        if (data.rows.length > 0) {
                            this.session.next({userId: data.rows.item(0).id});
                            observer.next(true);
                        } else {
                            this.session.next(null);
                            observer.next(false);
                        }
                        observer.complete();
                    })
            )
        );
    }

    private getPassHash(credentials: Credentials): string {
        return <string>Md5.hashStr(credentials.login + credentials.password);
    }

    logout(): Observable<true> {
        return Observable.create(observable => {
            this.session.next(null);
            observable.next(true);
            observable.complete();
        });
    }

    createUser(credentials: Credentials): Observable<boolean> {
        return Observable.create(observer =>
            this.db.transaction(tx =>
                tx.executeSql(`INSERT INTO users (name, login, password_hash) VALUES
                  (?, ?, ?)`, [credentials.name, credentials.login, this.getPassHash(credentials)])
                    .then(() => credentials.email && tx.executeSql(`
                      INSERT INTO userData (user_id, email) SELECT
                                                              id,
                                                              ?
                                                            FROM users
                                                            WHERE login = ?
                    `, [credentials.email, credentials.login]))
                    .then(() => observer.next(true))
                    .then(() => observer.complete())
                    .catch(observer.error)
            )
        );
    }

    getUser(session: Session): Observable<User> {
        console.log(session);
        return Observable.create(observer => {
                if (session == null) {
                    observer.error('No such user!');
                } else
                    this.db.transaction(tx =>
                        tx.executeSql(`SELECT
                                         name,
                                         login
                                       FROM users
                                       WHERE id == ?`, [session.userId])
                            .then(data => {
                                console.log(data);
                                if (data.rows.length > 0) {
                                    let item = data.rows.item(0);
                                    observer.next(new User(item.name, item.login));
                                    observer.complete();
                                } else {
                                    observer.error('No such user!');
                                }
                            })
                    )
            }
        );
    }


    createRecipe(recipe: Recipe): Observable<boolean> {
        return Observable.create(observer => this.db.transaction(tx =>
            tx.executeSql(`INSERT INTO recipes (name, description)
            VALUES (?, ?)`, [recipe.name, recipe.description]))
            .then(() => observer.next(true))
            .then(() => observer.complete())
            .catch(observer.error)
        );
    }

    private updateTablesStructure(): Promise<any> {
        return dbUpgradeList.upgrade(this.db);
    }
}




