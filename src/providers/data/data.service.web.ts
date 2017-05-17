import {
    Credentials,
    Recipe,
    Session,
    User
} from "./datatypes";
import {
    Inject,
    Injectable
} from "@angular/core";
import {PLATFORM_READY} from "../../app/app.tokens";
import {Observable} from "rxjs/Observable";
import {DataService} from "./data.service";

@Injectable()
export class DataServiceWeb extends DataService {

    constructor(@Inject(PLATFORM_READY) ready: Promise<void>) {
        super();
        this.session.next({userId: "test"}); // Always logged at start
        ready.then(() => {
            let saved = JSON.parse(localStorage.getItem('recipes'));

            this.recipes.next((saved instanceof Array) ? saved : []);
            console.log(this.recipes.getValue());
        });
    }

    createRecipe(recipe: Recipe): Observable<boolean> {
        return Observable.create(observable => {
            this.recipes.next([...this.recipes.getValue(), recipe]);
            localStorage.setItem('recipes', JSON.stringify(this.recipes.getValue()));
            observable.next(true);
            observable.complete();
        });
    }

    login(credentials: Credentials): Observable<boolean> {
        return Observable.create(observable => {
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

    createUser(credentials: Credentials): Observable<boolean> {
        return Observable.create(observer => {
            observer.next(true);
            observer.complete();
        })
    }

}
