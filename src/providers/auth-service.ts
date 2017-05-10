import {Injectable} from "@angular/core";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/toPromise";
import {Observable} from "rxjs/Observable";
import {
    DataService,
    User
} from "../services/data.service";


@Injectable()
export class AuthService {
    private currentUser: User;

    constructor(private dataService: DataService) {
        dataService.session$.flatMap(this.dataService.getUser)
            .subscribe(
                res => this.currentUser = res,
                error => this.currentUser = null
            );
    }

    public get loggedIn(): boolean {
        return this.currentUser != null;
    }

    public login(credentials: { email: string, password: string }): Observable<boolean> {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {
            return this.dataService.login(credentials);
        }
    }

    public register(credentials): Observable<boolean> {
        if (credentials.email === null || credentials.password === null) {
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
