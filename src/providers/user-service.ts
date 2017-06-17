import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {
    Credentials,
    Role,
    User,
    UserDetails,
    UserWithRole
} from "./data/datatypes";
import {Observable} from "rxjs/Observable";
import {
    DB,
    firstRowAsObject,
    rowsAsArray
} from "./data/database/sqlite.implementation";
import {AuthService} from "./auth-service";

@Injectable()
export class UserService {

    private users: BehaviorSubject<User[]> = new BehaviorSubject([]);
    users$: Observable<User[]>;

    private user: User;

    constructor(public db: DB, private authService: AuthService) {
        this.users$ = this.users.asObservable();

        this.authService.currentUser$.subscribe((user) => {
            this.user = user;
        });
        this.fetchUsers();

    }

    private fetchUsers():Promise<any> {
        return this.db.transaction(tx => tx.executeSql(`SELECT
                                                   u.name  AS name,
                                                   u.id    AS id,
                                                   d.email AS email
                                                 FROM users AS u LEFT JOIN userData AS d
                                                     ON u.id = d.user_id`, []))
            .then(data => rowsAsArray(data))
            .then(users => this.users.next(users));
    }

    create(credentials: Credentials): Observable<boolean> {
        if (credentials.login === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        }
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(
                    `INSERT INTO users (name, login, password_hash) VALUES (?, ?, ?)`,
                    [credentials.name, credentials.login, this.authService.getPassHash(credentials)]
                )
                    .then(data => Promise.all([
                        tx.executeSql(
                            `INSERT INTO userData (email, user_id) VALUES (?, ?)`,
                            [credentials.email, data.insertId]
                        ),
                        tx.executeSql(
                            `INSERT INTO userRoles (role_id, user_id) VALUES (?, ?)`,
                            [Role.INTERN,data.insertId]
                        )
                    ]))
            )
                .then(this.fetchUsers.bind(this))
                .then(()=>true)
        );
    }

    save(user: UserWithRole): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx => Promise.all([
                tx.executeSql(
                    `UPDATE users SET name=? WHERE id=?`,
                    [user.name, user.id]
                ),
                tx.executeSql(
                    `UPDATE userData SET email=? WHERE user_id=?`,
                    [user.email, user.id]
                ),
                tx.executeSql(
                    `UPDATE userRoles SET role_id=? WHERE user_id=?`,
                    [user.role, user.id]
                ),
            ]))
                .then(this.fetchUsers.bind(this))
                .then(() => true)
        );
    }

    deleteItem(item: User): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(
                    `DELETE FROM users WHERE id=?`,
                    [item.id]
                )
            )
                .then(this.fetchUsers.bind(this))
                .then(() => true)
        );
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
                        let user: UserDetails = firstRowAsObject(dataArr[0]);
                        user.completedRecipes = rowsAsArray(dataArr[1]);
                        user.composedRecipes = rowsAsArray(dataArr[2]);
                        return user;
                    })
                    .catch(error => console.log(error))
            )
        );
    }


}
