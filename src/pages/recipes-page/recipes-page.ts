import {
    ChangeDetectionStrategy,
    Component
} from "@angular/core";
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
 * Generated class for the RecipesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-recipes-page',
    templateUrl: 'recipes-page.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class RecipesPage {
    private recipes: Recipe[] = [];

    constructor(public navCtrl: NavController,
                private recipesService: RecipesService,
                public navParams: NavParams,
                private loadingCtrl: LoadingController) {
        recipesService.recipes$.subscribe((res) => {
            console.log(res);
            this.recipes = res;
        });
    }

    deleteRecipe(recipe) {
        let loading = this.loadingCtrl.create({dismissOnPageChange:true, content:'Deleting'});
        loading.present()
            .then(() => this.recipesService.deleteRecipe(recipe))
            .then(() => loading.dismiss())
            .catch(error => console.log(error));
    }

    createRecipe(title:string) {
        let value: Recipe = {name:title, description:''};
        let loading = this.loadingCtrl.create({content:'Creating recipe'});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.recipesService.createRecipe(value))
            .flatMap(success => loading.dismiss())
            .subscribe();

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipesPage');
    }

}
