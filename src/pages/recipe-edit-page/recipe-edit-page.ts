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
import {Subject} from "rxjs/Subject";
import {StepsService} from "../../providers/steps-service";

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
    private detailsSubject: Subject<any>;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl: LoadingController,
                private recipesService: RecipesService,
                private stepService: StepsService) {

        this.detailsSubject = new Subject();
        this.detailsSubject
            .flatMap(() => this.recipesService.getRecipe(this.navParams.data.id))
            .subscribe(data => this.details = data);


    }

    ionViewWillEnter() {
        this.detailsSubject.next();
    }

    saveRecipe(value) {
        this.recipesService.save(value);
    }

    createStep(title: string) {
        let step: Step = {
            name: title, description: '',
            step_number: this.getNextStepNumber()
        };
        let loading = this.loadingCtrl.create({content: 'Saving recipe'});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.recipesService.addStep(step, this.details))
            .flatMap(success => loading.dismiss())
            .map(() => this.detailsSubject.next())
            .subscribe();
    }

    getNextStepNumber(): number {
        return this.details && this.details.steps ? this.details.steps.length : 0;
    }

    deleteStep(step: Step) {
        let loading = this.loadingCtrl.create({content: 'Saving recipe'});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.stepService.deleteStep(step))
            .flatMap(success => loading.dismiss())
            .map(() => this.detailsSubject.next())
            .subscribe();

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipeEditPage');
    }

}
