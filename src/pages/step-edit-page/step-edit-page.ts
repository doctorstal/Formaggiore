import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import {
    MediaType,
    Step,
    StepDetails
} from "../../providers/data/datatypes";
import {RecipesService} from "../../providers/recipes-service";
import {Observable} from "rxjs/Observable";
import {Camera} from "@ionic-native/camera";

/**
 * Generated class for the StepEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-step-edit-page',
    templateUrl: 'step-edit-page.html',
})
export class StepEditPage {

    private step: Step;

    public base64Images: string[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl: LoadingController,
                private recipesService: RecipesService,
                private camera: Camera) {
        this.step = navParams.data;
        this.recipesService.getStepMedia(this.step.id)
            .map(media => media.map(m => this.base64Images.push(m.content)))
            .subscribe();
    }

    save(value: Step) {
        let stepDetails: StepDetails = {
            ...value,
            media: this.base64Images.map(base64 => {
                return {
                    type: MediaType.PHOTO,
                    content: base64
                }
            })
        };
        let loading = this.loadingCtrl.create({content: 'Saving', dismissOnPageChange: true});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.recipesService.saveStep(stepDetails))
            .flatMap(success =>
                loading.dismiss()
                    .then(() => this.navCtrl.pop())
            ).subscribe();
    }

    removePicture(index: number) {
        this.base64Images.splice(index, 1);
    }

    takePicture() {
        this.camera.getPicture({
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.base64Images.push("data:image/jpeg;base64," + imageData);
        }, (err) => {
            console.log(err);
        });
    }

    browseMedia() {
        this.camera.getPicture({
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.PICTURE
        })
            .then((imageData) => {
                this.base64Images.push("data:image/jpeg;base64," + imageData);
            })
            .catch(console.log);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StepEditPage');
    }

}
