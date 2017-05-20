import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import {Observable} from "rxjs/Observable";
import {RecipesService} from "../../providers/recipes-service";
import {
    Recipe,
    Step
} from "../../providers/data/datatypes";

/**
 * Generated class for the RecipeEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-recipe-edit-page',
    templateUrl: 'recipe-edit-page.html',
})
export class RecipeEditPage {

    private details: Recipe;
    private details$: Observable<Recipe>;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl: LoadingController,
                private recipesService: RecipesService) {

        this.details$ = this.recipesService.getRecipe(this.navParams.data.id)
            .map(data => this.details = data);

        this.details$.subscribe();


    }

    saveRecipe(value) {
        let loading = this.loadingCtrl.create({content: 'Saving recipe'});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.recipesService.save(value))
            .flatMap(success =>
                loading.dismiss()
                    .then(() => this.navCtrl.pop())
            ).subscribe();
    }

    createStep(title: string) {
        let step: Step = {
            name: title, description: '',
            step_number: this.getNextStepNumber()
        };
        let loading = this.loadingCtrl.create({content: 'Saving recipe'});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.recipesService.addStep(step, this.details))
            .map(() => this.details$.subscribe())
            .flatMap(success => loading.dismiss())
            .subscribe();
    }

    getNextStepNumber(): number {
        return this.details && this.details.steps ? this.details.steps.length : 0;
    }

    deleteStep(step: Step) {
        let loading = this.loadingCtrl.create({content: 'Saving recipe'});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.recipesService.addStep(step, this.details))
            .map(() => this.details$.subscribe())
            .flatMap(success => loading.dismiss())
            .subscribe();

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipeEditPage');
    }

}
