import {Component} from "@angular/core";
import {
    AlertController,
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import {
    FormBuilder,
    FormGroup,
    Validators
} from "@angular/forms";
import {DataService} from "../../providers/data/data.service";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/fromPromise";
import {Observable} from "rxjs/Observable";

/**
 * Generated class for the CreateRecipePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-create-recipe-page',
    templateUrl: 'create-recipe-page.html',
})
export class CreateRecipePage {
    private recipe: FormGroup;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                private dataService: DataService,
                private formBuilder: FormBuilder) {
        this.recipe = formBuilder.group({
            name: ['', Validators.required],
            description: ['']
        })
    }

    createRecipe() {
        console.log(this.recipe.value);
        const successAlert = {
            title: "Success",
            subTitle: "New recipe has been created",
            buttons: [
                {
                    text: 'OK',
                    handler: data => {this.navCtrl.push('RecipesPage');}
                }
            ]
        };
        const errorAlert = {title: "Error", subTitle: "Failed to create recipe"};
        let loading = this.loadingCtrl.create();
        Observable.fromPromise(loading.present())
            .flatMap(() => this.dataService.createRecipe(this.recipe.value))
            .flatMap(success =>
                loading.dismiss()
                    .then(() => this.alertCtrl.create(success ? successAlert : errorAlert).present())
            ).subscribe();
    }

}
