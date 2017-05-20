import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {
    Media,
    MediaType,
    Step
} from "../../providers/data/datatypes";
import {
    Camera,
    CameraOptions
} from "@ionic-native/camera";
import {StepsService} from "../../providers/steps-service";

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

    public media: Media[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private stepsService: StepsService,
                private camera: Camera) {
        this.step = navParams.data;
        this.stepsService.getStepMedia(this.step.id)
            .map(media => this.media = media)
            .subscribe();
    }

    save(value: Step) {
        this.stepsService.saveStepTitleAndDescription(value);
    }

    removePicture(index: number) {
        this.stepsService.removeStepMedia(this.step, this.media.splice(index, 1)[0])
    }

    takePicture() {
        let options = {
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000
        };
        this.loadPictureToStep(options);
    }

    private loadPictureToStep(options: CameraOptions) {
        this.camera.getPicture(options).then((imageData) => {
            // imageData is a base64 encoded string
            let m: Media = {
                content: "data:image/jpeg;base64," + imageData,
                type: MediaType.PHOTO
            };
            this.media.push(m);
            this.stepsService.addStepMedia(this.step, m).subscribe();
        }, (err) => {
            console.log(err);
        });
    }

    browseMedia() {
        let options = {
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.loadPictureToStep(options);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StepEditPage');
    }

}
