import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController,
    NavParams,
    PopoverController
} from "ionic-angular";
import {
    RecipeDetails,
    StepDetails
} from "../../providers/data/datatypes";
import {Subject} from "rxjs/Subject";
import {RecipesService} from "../../providers/recipes-service";
import {isUndefined} from "util";
import {ChooseDevicePopover} from "./choose-device-popover/choose-device-popover";
import {Observable} from "rxjs/Observable";
import * as moment from "moment";
import {Insomnia} from "@ionic-native/insomnia";


@IonicPage()
@Component({
    selector: 'page-recipe-details-page',
    templateUrl: 'recipe-details-page.html',
})
export class RecipeDetailsPage {

    private details: RecipeDetails;
    private detailsSubject: Subject<any>;

    private started: boolean = false;
    private finished: boolean = false;
    private currentStep: StepDetails;
    private currentIndex: number = 0;
    private currentDevice: String;
    private currentTime: string;


    constructor(public navCtrl: NavController, public navParams: NavParams,
                private recipesService: RecipesService,
                private insomnia: Insomnia,
                private loadingCtrl: LoadingController,
                private popoverCtrl: PopoverController) {
        if (isUndefined(this.navParams.data.id)) {
            this.navParams.data.id = 1;
        }
        this.detailsSubject = new Subject();
        this.detailsSubject
            .flatMap(() => this.recipesService.getRecipeDetails(this.navParams.data.id))
            .subscribe(recipe => this.details = recipe);
    }

    startRecipe() {
        let loading = this.loadingCtrl.create();
        loading.present()
            .then(() => this.insomnia.keepAwake())
            .then(() => {
                this.started = true;
                this.updateCurrentStep();
            })
            .catch(error => console.log("Error calling insomnia: " + error))
            .then(() => loading.dismiss());
    }

    nextStep() {
        this.currentIndex++;
        this.updateCurrentStep();
    }

    private updateCurrentStep() {
        if (this.currentIndex < this.details.steps.length) {
            this.currentStep = this.details.steps[this.currentIndex];
        } else {
            let loading = this.loadingCtrl.create();
            loading.present()
                .then(() => this.insomnia.allowSleepAgain())
                .then(() => {
                    this.currentStep = null;
                    this.finished = true;
                })
                .then(() => loading.dismiss());
        }
    }

    startOver() {

        this.currentIndex = 0;
        this.started = false;
        this.finished = false;
    }

    chooseDevice() {
        let popover = this.popoverCtrl.create(ChooseDevicePopover,
            {
                directive: this.currentStep.directive,
                startCallback: deviceId => {
                    popover.dismiss()
                        .then(() => this.deviceChosen(deviceId));
                }
            },
            {showBackdrop: true, enableBackdropDismiss: true});

        popover.present();

    }

    deviceChosen(id: string) {
        this.currentDevice = id;
        this.startTimer(this.currentStep.directive.time);
    }

    startTimer(time: number) {
        Observable.interval(1000)
            .take(time * 60 + 1)
            .map(t => time * 60 - t)
            .map(t => t * 1000)
            .subscribe(t => this.currentTime = moment(t).utc().format("HH:mm:ss"),
                null,
                () => this.finishTimer()
            );
    }

    finishTimer() {
        this.currentTime = "";
        this.currentDevice = "";
        this.nextStep();
    }

    ionViewWillEnter() {
        this.detailsSubject.next();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipeDetailsPage');
    }

}
