import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {
    Media,
    MediaType,
    SensorDirective,
    Step,
    StepDetails
} from "../../providers/data/datatypes";
import {
    Camera,
    CameraOptions
} from "@ionic-native/camera";
import {StepsService} from "../../providers/steps-service";
import {isUndefined} from "util";
import {DevicesService} from "../../providers/devices-service";
import {SensorType} from "../../protocol/device";

@IonicPage()
@Component({
    selector: 'page-step-edit-page',
    templateUrl: 'step-edit-page.html',
})
export class StepEditPage {

    private step: StepDetails;
    private media: Media[] = [];

    private sensorTypes: SensorType[];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private stepsService: StepsService,
                private devicesService: DevicesService,
                private camera: Camera) {
        if (isUndefined(navParams.data.id)) {
            // navCtrl.setRoot('RecipesPage');
            this.step = {id: 6, name: '', description: ''};
        } else {
            this.step = navParams.data;
        }
        this.devicesService.sensorTypes$
            .subscribe(sTypes => this.sensorTypes = sTypes);
    }

    ionViewWillEnter() {
        this.loadStepDetails();
    }

    ionViewCanEnter(): boolean {
        return !isUndefined(this.step.id);
    }

    private loadStepDetails() {
        this.stepsService.getStepDetails(this.step.id)
            .subscribe(stepDetails => {
                this.step = stepDetails;
                this.media = stepDetails.media;
            })
    }

    save(value: Step) {
        this.stepsService.saveStepTitleAndDescription(value)
            .subscribe(() => this.loadStepDetails());
    }

    saveDirective(value: SensorDirective) {
        this.stepsService.saveDirective(this.step.id, value)
            .subscribe(() => this.loadStepDetails());

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

    createDirective() {
        this.step.directive = {
            sTypeToken: "",
            startValue: 0,
            endValue: 0,
            time: 0
        };
    }

}
