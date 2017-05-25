import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {RecipeDetails} from "../../providers/data/datatypes";
import {Subject} from "rxjs/Subject";
import {RecipesService} from "../../providers/recipes-service";
import {StepsService} from "../../providers/steps-service";


/**
 * Generated class for the RecipeDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-recipe-details-page',
    templateUrl: 'recipe-details-page.html',
})
export class RecipeDetailsPage {

    private details: RecipeDetails;
    private detailsSubject: Subject<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private recipesService: RecipesService,
                private stepService: StepsService) {
        /*this.detailsSubject = new Subject();
         let getRecipe$ = this.detailsSubject
         .flatMap(() => this.recipesService.getRecipe(this.navParams.data.id));

         getRecipe$.subscribe(data => {
         console.log("1data", data);
         this.details = data;
         });

         getRecipe$
         .delay(10)
         .flatMap(data =>
         Observable.forkJoin(data.steps && data.steps.map(step =>
         this.stepService.getStepMedia(step.id))
         )
         )
         .subscribe(medias => {
         this.details.steps &&
         this.details.steps.map((step, index) =>
         step.media = medias[index]);
         });*/
        this.detailsSubject = new Subject();
        this.detailsSubject
            .flatMap(() => this.recipesService.getRecipeDetails(this.navParams.data.id))
            .subscribe(recipe => this.details = recipe);
    }

    ionViewWillEnter() {
        this.detailsSubject.next();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipeDetailsPage');
    }

}
