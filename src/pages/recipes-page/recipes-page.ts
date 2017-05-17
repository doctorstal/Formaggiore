import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {DataService} from "../../providers/data/data.service";
import {Recipe} from "../../providers/data/datatypes";

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
})
export class RecipesPage {
    private recipes: Recipe[];

    constructor(public navCtrl: NavController,
                private dataService: DataService,
                public navParams: NavParams) {
        dataService.recipes$.subscribe((res) => {
            console.log(res);
            this.recipes = res;
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipesPage');
    }

}
