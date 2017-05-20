import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import {Recipe} from "../../providers/data/datatypes";
import {RecipesService} from "../../providers/recipes-service";
import {Observable} from "rxjs/Observable";

/**
 * Generated class for the StepCreatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-step-create-page',
    templateUrl: 'step-create-page.html',
})
export class StepCreatePage {

    recipe: Recipe;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private loadingCtrl: LoadingController,
                private recipesService: RecipesService) {
        this.recipe = navParams.data;
    }

    createStep(value) {
        let loading = this.loadingCtrl.create({content: 'Saving step'});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.recipesService.craeteStep(this.recipe, value))
            .flatMap(success => loading.dismiss())
            .subscribe(() => this.navCtrl.pop());
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StepCreatePage');
    }

}
