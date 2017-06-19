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
    RecipeDetails,
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

    getRecipeDetails(id: number): Observable<RecipeDetails> {
        return Observable.fromPromise(
            this.db.transaction(tx => Promise.all([
                tx.executeSql(`SELECT
                                 id,
                                 name,
                                 description
                               FROM recipes
                               WHERE id = ?`, [id])
                    .then(data => data.rows.length > 0 ? data : Promise.reject('No such recipe')),
                tx.executeSql(`SELECT
                                 id,
                                 name,
                                 description,
                                 step_number
                               FROM steps
                               WHERE recipe_id = ?
                               ORDER BY step_number`, [id]),
                tx.executeSql(`SELECT
                                 s.id      AS step,
                                 m.id      AS id,
                                 m.content AS content,
                                 m.type_id AS type
                               FROM steps AS s
                                 JOIN stepMedias ON s.id = stepMedias.step_id
                                 JOIN medias AS m ON stepMedias.media_id = m.id
                               WHERE s.recipe_id = ?`, [id]),
                tx.executeSql(`SELECT
                                 s.id          AS step,
                                 d.id          AS id,
                                 d.start_value AS startValue,
                                 d.end_value   AS endValue,
                                 d.time        AS time,
                                 st.token      AS sTypeToken,
                                 st.name       AS sTypeName
                               FROM steps AS s
                                 JOIN stepDirectives ON s.id = stepDirectives.step_id
                                 JOIN directives AS d ON stepDirectives.directive_id = d.id
                                 JOIN sTypes AS st ON d.stype_id = st.id
                               WHERE s.recipe_id = ?`, [id])
            ]))
                .then(arr => {
                    let media: any[] = rowsAsArray(arr[2]);
                    let directives: any[] = rowsAsArray(arr[3]);
                    let recipe: RecipeDetails = {
                        ...arr[0].rows.item(0),
                        steps: rowsAsArray(arr[1])
                    };
                    recipe.steps.forEach(step => step.media = media.filter(media => media.step == step.id));
                    recipe.steps.forEach(step => step.directive = directives.find(directive => directive.step == step.id));
                    return recipe;
                })
        )
    }

    getRecipe(id: number): Observable<Recipe> {
        return Observable.fromPromise(
            this.db.transaction(tx => Promise.all([
                tx.executeSql(`SELECT
                                 id,
                                 name,
                                 description
                               FROM recipes
                               WHERE id = ?`, [id])
                    .then(data => data.rows.length > 0 ? data : Promise.reject('No such recipe')),
                tx.executeSql(`SELECT
                                 id,
                                 name,
                                 description,
                                 step_number
                               FROM steps
                               WHERE recipe_id = ?
                               ORDER BY step_number`, [id]),
            ]))
                .then(arr => {
                    return {
                        ...arr[0].rows.item(0),
                        steps: rowsAsArray(arr[1])
                    };
                })
        )
    }
}
