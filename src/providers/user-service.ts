import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {
    Credentials,
    User,
    UserDetails
} from "./data/datatypes";
import {Observable} from "rxjs/Observable";
import {
    DB,
    rowsAsArray
} from "./data/database/sqlite.implementation";
import {AuthService} from "./auth-service";

@Injectable()
export class UserService {

    private users: BehaviorSubject<User[]> = new BehaviorSubject([
        {id: 0, name: 'Did you know?', description: 'Your princes is in another castle'}
    ]);
    private nextId: number = 1;
    users$: Observable<User[]>;

    private user: User;

    constructor(public db: DB, private authService: AuthService) {
        this.users$ = this.users.asObservable();
        this.users$.subscribe(console.log.bind(null, "Users: "));

        this.authService.currentUser$.subscribe((user) => {
            this.user = user;
            this.fetchUsers();
        });
    }

    private fetchUsers() {
        this.db.transaction(tx => tx.executeSql(`SELECT
                                                   u.name  AS name,
                                                   u.id    AS id,
                                                   d.email AS email
                                                 FROM users AS u LEFT JOIN userData AS d
                                                     ON u.id = d.user_id`, []))
            .then(data => data.rows)
            .then(rows => {
                let users: User[] = [];
                for (let i = 0; i < rows.length; i++) {
                    let item = rows.item(i);
                    users.push({...item});
                }
                this.users.next(users);
            });
    }

    create(credentials: Credentials): Observable<boolean> {
        if (credentials.login === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        }
        return Observable.create(observer =>
            this.db.transaction(tx =>
                tx.executeSql(`INSERT INTO users (name, login, password_hash) VALUES (?, ?, ?)`,
                    [credentials.name, credentials.login, this.authService.getPassHash(credentials)])
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

    save(item: User): Observable<boolean> {
        return Observable.create(observer => {
            this.users.next(
                this.users.getValue()
                    .map(itemInList => itemInList.id == item.id ? item : itemInList));
            observer.next(true);
            observer.complete();
        });
    }

    deleteItem(item: User): Observable<boolean> {
        return Observable.create(observer => {
            this.users.next(
                this.users.getValue()
                    .filter(itemInList => itemInList.id != item.id));
            observer.next(true);
            observer.complete();
        });
    }

    getUserDetails(id: number): Observable<UserDetails> {
        return Observable.fromPromise(
            this.db.transaction(tx => Promise.all([
                    tx.executeSql(`SELECT
                                     u.id,
                                     u.name,
                                     u.login,
                                     d.email,
                                     r.id   AS role,
                                     r.name AS roleName
                                   FROM users AS u LEFT JOIN userData AS d ON u.id = d.user_id
                                     LEFT JOIN userRoles ON u.id = userRoles.user_id
                                     LEFT JOIN roles AS r ON userRoles.role_id = r.id
                                   WHERE u.id = ?`, [id])
                        .then(data => data.rows.length > 0 ? data : Promise.reject('No user with id ' + id)),
                    tx.executeSql(`SELECT
                                     r.id,
                                     r.name,
                                     r.description
                                   FROM completedRecipes AS c
                                     JOIN recipes AS r ON c.recipe_id = r.id
                                   WHERE c.user_id = ?`, [id]),
                    tx.executeSql(`SELECT
                                     r.id,
                                     r.name,
                                     r.description
                                   FROM main.recipeAuthors AS a
                                     JOIN recipes AS r ON a.recipe_id = r.id
                                   WHERE a.user_id = ?`, [id]),
                ])
                    .then(dataArr => {

                        let user: UserDetails = {...dataArr[0].rows.item(0)};
                        user.completedRecipes = rowsAsArray(dataArr[1]);
                        user.composedRecipes = rowsAsArray(dataArr[2]);
                        return user;
                    })
                    .catch(error => console.log(error))
            )
        );
    }


}
