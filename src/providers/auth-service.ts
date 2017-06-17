import {Injectable} from "@angular/core";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/toPromise";
import "rxjs";
import {Observable} from "rxjs/Observable";
import {
    Credentials,
    Session,
    UserWithRole
} from "./data/datatypes";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Md5} from "ts-md5/dist/md5";
import {Subject} from "rxjs/Subject";
import {
    DB,
    firstRowAsObject
} from "./data/database/sqlite.implementation";


@Injectable()
export class AuthService {
    protected session: Subject<Session> = new BehaviorSubject(null);
    session$: Observable<Session> = this.session.asObservable();

    private currentUser: BehaviorSubject<UserWithRole> = new BehaviorSubject(null);
    public currentUser$: Observable<UserWithRole>;

    constructor(private db: DB) {
        this.currentUser$ = this.currentUser.asObservable();
        this.currentUser$.subscribe(console.log.bind(null, "Current user:"));

        this.session.next(JSON.parse(localStorage.getItem('session')));
        this.session$.subscribe(session=>localStorage.setItem('session', JSON.stringify(session)));
        this.session$
            .switchMap(session =>
                session ? this.getUser(session)
                    .catch(error => {
                        this.currentUser.next(null);
                        return Observable.empty<UserWithRole>();
                    }) : Observable.of(null))
            .subscribe(
                res => this.currentUser.next(res),
                error => console.log("Fatal error while getting session info." + error)
            );

    }

    public get loggedIn(): boolean {
        return this.currentUser.getValue() != null;
    }

    public getPassHash(credentials: Credentials): string {
        return <string>Md5.hashStr(credentials.login + credentials.password);
    }

    login(credentials: Credentials): Observable<boolean> {
        if (credentials.login === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        }
        // TODO we should actually create session in DB
        return Observable.create(observer =>
            this.db.transaction(tx =>
                tx.executeSql(`SELECT id
                               FROM users
                               WHERE login = ? AND password_hash = ?`,
                    [credentials.login, this.getPassHash(credentials)])
            ).then(data => {
                console.log("Login: " + data);
                if (data.rows.length > 0) {
                    console.log(data.rows.item(0));
                    this.session.next({userId: data.rows.item(0).id});
                    observer.next(true);
                } else {
                    this.session.next(null);
                    observer.next(false);
                }
                observer.complete();
            }).catch(error => console.log(error))
        );
    }


    logout(): Observable<true> {
        return Observable.create(observable => {
            this.session.next(null);
            observable.next(true);
            observable.complete();
        });
    }

    getUser(session: Session): Observable<UserWithRole> {
        return Observable.create(observer => {
                if (session == null) {
                    observer.error('No such user!');
                } else
                    this.db.transaction(tx =>
                        tx.executeSql(`SELECT
                                         users.id,
                                         users.name,
                                         users.login,
                                         roles.id AS role
                                       FROM users
                                         LEFT JOIN userRoles ON users.id = userRoles.user_id
                                         LEFT JOIN roles ON userRoles.role_id = roles.id
                                       WHERE users.id == ?`, [session.userId]))
                        .then(data => {
                            console.log(data);
                            if (data.rows.length > 0) {
                                observer.next(firstRowAsObject(data));
                                observer.complete();
                            } else {
                                observer.error('No such user!');
                            }
                        })

            }
        );
    }
}
