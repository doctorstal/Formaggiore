import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {RecipesService} from "../../providers/recipes-service";

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

    recipe: FormGroup;
    steps: FormArray;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private formBuilder: FormBuilder,
                private loadingCtrl: LoadingController,
                private recipesService: RecipesService) {
        let details = navParams.data;

        /* TODO remove*/
        details.steps = [
            {id:1, name:'Step1', description:'Put milk on fire'},
            {id:2, name:'Step2', description:'Wait until it is hot'},
        ];

        this.steps = new FormArray([]);
        details.steps && details.steps.forEach(step => this.steps.push(new FormControl(step)));
        this.recipe = formBuilder.group({
            name: [details.name, Validators.required],
            description: [details.description],
            id: details.id,
            steps: this.steps
        })

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

    test() {

    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipeEditPage');
    }

}
