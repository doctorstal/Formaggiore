import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {DevicesService} from "../../providers/devices-service";
import {SensorType} from "../../protocol/device";

/**
 * Generated class for the SensorTypesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-sensor-types-page',
    templateUrl: 'sensor-types-page.html',
})
export class SensorTypesPage {

    private sensors:SensorType[];

    constructor(private devicesService: DevicesService,
                public navCtrl: NavController,
                public navParams: NavParams) {
        devicesService.sensorTypes$
            .do(console.log)
            .subscribe(sensors => this.sensors = sensors);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SensorTypesPage');
    }

}
