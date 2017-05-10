import {
    DataService,
    Recipe
} from "../services/data.service";
import {
    Inject,
    Injectable
} from "@angular/core";
import {PLATFORM_READY} from "../app/app.tokens";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DataServiceWeb extends DataService {
    private recipesStorage: Recipe[];

    constructor(@Inject(PLATFORM_READY) ready: Promise<void>) {
        super();
        ready.then(() => {
            let saved = JSON.parse(localStorage.getItem('recipes'));
            this.recipesStorage = (saved instanceof Array) ? saved : [];
            this.recipes.next(this.recipesStorage);
            console.log(this.recipesStorage);
        });
    }

    createRecipe(recipe: Recipe): Observable<boolean> {
        return Observable.create(observable => {
            this.recipesStorage.push(recipe);
            localStorage.setItem('recipes', JSON.stringify(this.recipesStorage));
            observable.next(true);
            observable.complete();
            this.recipes.next(this.recipesStorage);
        });
    }

}
