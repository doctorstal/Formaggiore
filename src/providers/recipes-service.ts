import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {DB} from "./data/database/sqlite.implementation";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {
    Recipe,
    Step
} from "./data/datatypes";
import {Observable} from "rxjs/Observable";


@Injectable()
export class RecipesService {
    protected recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject([]);
    recipes$: Observable<Recipe[]> = this.recipes.asObservable();


    constructor(public db: DB) {
        this.getRecipes();
    }

    createRecipe(recipe: Recipe): Observable<boolean> {
        return Observable.create(observer =>
            this.db.transaction(
                tx => tx.executeSql(`INSERT INTO recipes (name, description)
                VALUES (?, ?)`, [recipe.name, recipe.description])
            )
                .then(() => observer.next(true))
                .then(() => observer.complete())
                .then(() => this.getRecipes())
                .catch(observer.error)
        );
    }


    private getRecipes(): Promise<any> {
        return this.db.transaction(
            tx => tx.executeSql(`SELECT *
                                 FROM recipes`, [])
        )
            .then(data => data.rows)
            .then(rows => {
                let recipes: Recipe[] = [];
                for (let i = 0; i < rows.length; i++) {
                    let item = rows.item(i);
                    recipes.push({...item});
                }
                this.recipes.next(recipes);
                console.log(recipes);
            });
    }

    deleteRecipe(recipe: Recipe): Promise<any> {
        return this.db.transaction(
            tx => tx.executeSql(`DELETE FROM recipes
            WHERE id = ?`, [recipe.id])
        )
            .then(() => this.getRecipes());
    }

    save(recipe: Recipe) {
        console.log(recipe);
        return this.db.transaction(
            tx => tx.executeSql(`UPDATE recipes
            SET name = ?, description = ?
            WHERE id = ?`, [recipe.name, recipe.description, recipe.id])
        )
            .then(data => console.log(data))
            .then(() => this.getRecipes());
    }

    craeteStep(recipe: Recipe, value: Step):Observable<boolean> {
        return Observable.create(observer => {
            recipe.steps = [...recipe.steps, value];
            observer.next(true);
            observer.complete();
        })
    }
}
