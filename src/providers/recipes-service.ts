import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
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
        return this.db.transaction(
            tx => tx.executeSql(`UPDATE recipes
            SET name = ?, description = ?
            WHERE id = ?`, [recipe.name, recipe.description, recipe.id])
        )
            .then(data => console.log(data))
            .then(() => this.getRecipes());
    }


    addStep(step: Step, recipe: Recipe): Observable<boolean> {
        return Observable.create(observer =>
            this.db.transaction(tx =>
                tx.executeSql(`INSERT INTO steps
                    (name, description, step_number, recipe_id) VALUES (?, ?, ?, ?)`,
                    [step.name, step.description, step.step_number, recipe.id]))
                .then(() => observer.next(true))
                .then(() => observer.complete())
        )
    }

    getSteps(recipe_id: number): Observable<Step[]> {
        return Observable.create(observer =>
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
                .then(data => data.rows)
                .then(rows => {
                    let steps: Step[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        steps.push({...rows.item(i)});
                    }
                    observer.next(steps);
                })
                .then(() => observer.complete())
                .catch(console.log.bind(this, "GET STEPS ERROR: "))
        );
    }

    fillRecipeSteps(recipe: Recipe): Observable<Recipe> {
        console.log(recipe);
        return this.getSteps(recipe.id)
            .map(steps => {
                return {...recipe, steps: steps}
            });
    }

    getRecipe(id: number): Observable<Recipe> {
        return Observable.create(observer =>
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
                .then(recipe => observer.next(recipe))
                .then(() => observer.complete())
                .catch(console.log.bind(this, "GET RECIPE ERROR"))
        );
    }

    saveStep(value: Step) {
        return Observable.create(observer =>
            this.db.transaction(tx =>
                tx.executeSql(`UPDATE steps
                SET name = ?, value = ?
                WHERE id = ?`, [value.name, value.description, value.id]))
                .then(() => observer.next(true))
                .then(() => observer.complete())
                .catch(error => observer.error(error))
        );
    }
}
