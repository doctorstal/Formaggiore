import {Component} from "@angular/core";
import {
    AlertController,
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/fromPromise";
import {Observable} from "rxjs/Observable";
import {RecipesService} from "../../providers/recipes-service";

@IonicPage()
@Component({
  selector: 'page-recipe-create-page',
  templateUrl: 'recipe-create-page.html',
})
export class RecipeCreatePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private recipesService: RecipesService) {

  }

  createRecipe(value) {
    console.log(value);
    const successAlert = {
      title: "Success",
      subTitle: "New recipe has been created",
      buttons: [
        {
          text: 'OK',
          handler: data => {this.navCtrl.popTo('RecipesPage');}
        }
      ]
    };
    const errorAlert = {title: "Error", subTitle: "Failed to create recipe"};
    let loading = this.loadingCtrl.create({content:'Creating recipe'});
    Observable.fromPromise(loading.present())
        .flatMap(() => this.recipesService.createRecipe(value))
        .flatMap(success =>
            loading.dismiss()
                .then(() => this.alertCtrl.create(success ? successAlert : errorAlert).present())
        ).subscribe();
  }

}
