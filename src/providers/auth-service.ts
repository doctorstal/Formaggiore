import {Injectable} from "@angular/core";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/toPromise";
import "rxjs";
import {Observable} from "rxjs/Observable";
import {DataService} from "./data/data.service";
import {
    Credentials,
    User
} from "./data/datatypes";


@Injectable()
export class AuthService {
    private currentUser: User;

    constructor(private dataService: DataService) {
        dataService.session$
            .switchMap(session =>
                session ? this.dataService.getUser(session)
                    .catch(error => {
                        this.currentUser = null;
                        return Observable.empty<User>();
                    }): Observable.of(null))
            .subscribe(
                res => this.currentUser = res,
                error => console.log("Fatal error while getting session info." + error)
            );
    }

    public get loggedIn(): boolean {
        return this.currentUser != null;
    }

    public login(credentials: { login: string, password: string }): Observable<boolean> {
        if (credentials.login === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {
            return this.dataService.login(credentials);
        }
    }

    public register(credentials: Credentials): Observable<boolean> {
        if (credentials.login === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {
            // At this point store the credentials to your backend!
            return this.dataService.createUser(credentials);
        }
    }

    public getUserInfo(): User {
        return this.currentUser;
    }

    public logout(): Observable<boolean> {
        return this.dataService.logout();
    }

}
