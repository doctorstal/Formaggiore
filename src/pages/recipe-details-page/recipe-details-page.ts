import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {Recipe} from "../../providers/data/datatypes";

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
    details:Recipe;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.details = navParams.data;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipeDetailsPage');
    }

}
