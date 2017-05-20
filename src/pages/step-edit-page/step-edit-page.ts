import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import {Step} from "../../providers/data/datatypes";
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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl: LoadingController,
                private recipesService: RecipesService,
                private camera: Camera) {
        this.step = navParams.data;
    }

    save(value: Step) {
        let loading = this.loadingCtrl.create({content: 'Saving', dismissOnPageChange: true});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.recipesService.saveStep(value))
            .flatMap(success =>
                loading.dismiss()
                    .then(() => this.navCtrl.pop())
            ).subscribe();
    }

    takePicture() {
        this.camera.getPicture({
            destinationType: this.camera.DestinationType.FILE_URI,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            // imageData is a base64 encoded string
            //this.base64Image = "data:image/jpeg;base64," + imageData;
        }, (err) => {
            console.log(err);
        });
    }

    takeVideo() {
        this.camera.getPicture({
            // Video will  always be returned by FILE_URI
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.CAMERA,
            mediaType: this.camera.MediaType.VIDEO

        }).then((imageData) => {
            // imageData is a base64 encoded string
            //
            // this.base64Video = "data:image/jpeg;base64," + imageData;

        }, (err) => {
            console.log(err);
        });
    }

    browseMedia() {
        this.camera.getPicture({
            // Video will always be returned by FILE_URI
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.ALLMEDIA
        })
            .then((imageData) => {
                console.log("We have it!");
            })
            .then(() => this.camera.cleanup())
            .catch(console.log);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StepEditPage');
    }

}
