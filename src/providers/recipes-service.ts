import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import "rxjs/observable/fromPromise";
import {
    DB,
    rowsAsArray
} from "./data/database/sqlite.implementation";
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
        this.fetchRecipes();
    }

    createRecipe(recipe: Recipe): Observable<boolean> {
        return Observable.create(observer =>
            this.db.transaction(
                tx => tx.executeSql(`INSERT INTO recipes (name, description)
                VALUES (?, ?)`, [recipe.name, recipe.description])
            )
                .then(() => observer.next(true))
                .then(() => observer.complete())
                .then(() => this.fetchRecipes())
                .catch(observer.error)
        );
    }


    // TODO I guess we should stick to Observable design here these methods should be refactored
    private fetchRecipes(): Promise<any> {
        return this.db.transaction(
            tx => tx.executeSql(`SELECT *
                                 FROM recipes`, [])
        )
            .then(data => rowsAsArray(data))
            .then(recipes => this.recipes.next(recipes))
    }

    deleteRecipe(recipe: Recipe): Promise<any> {
        return this.db.transaction(
            tx => tx.executeSql(`DELETE FROM recipes
            WHERE id = ?`, [recipe.id])
        )
            .then(() => this.fetchRecipes());
    }

    save(recipe: Recipe): Promise<any> {
        return this.db.transaction(
            tx => tx.executeSql(`UPDATE recipes
            SET name = ?, description = ?
            WHERE id = ?`, [recipe.name, recipe.description, recipe.id])
        )
            .then(data => console.log(data))
            .then(() => this.fetchRecipes());
    }


    addStep(step: Step, recipe: Recipe): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(`INSERT INTO steps
                    (name, description, step_number, recipe_id) VALUES (?, ?, ?, ?)`,
                    [step.name, step.description, step.step_number, recipe.id]))
                .then(() => true)
                .catch(console.log)
        )
    }



    getSteps(recipe_id: number): Observable<Step[]> {
        return Observable.fromPromise(
            this.db.transaction(tx => tx.executeSql(`
              SELECT
                id,
                name,
                description,
                step_number
              FROM steps
              WHERE recipe_id = ?
              ORDER BY step_number
            `, [recipe_id]))
                .then(data => rowsAsArray(data))
                .catch(console.log.bind(this, "GET STEPS ERROR: "))
        );
    }

    fillRecipeSteps(recipe: Recipe): Observable<Recipe> {
        return this.getSteps(recipe.id)
            .map(steps => {
                return {...recipe, steps: steps}
            });
    }

    getRecipe(id: number): Observable<Recipe> {
        // TODO ok, this can be done like in UserService. Check that out and refactor.
        return Observable.fromPromise(
            this.db.transaction(tx => tx.executeSql(`
              SELECT
                id,
                name,
                description
              FROM recipes
              WHERE id = ?
            `, [id]))
                .then(data => data.rows)
                .then(rows => rows.length > 0 ?
                    this.fillRecipeSteps({...rows.item(0)}).toPromise()
                    : {}
                )
        );
    }











}
