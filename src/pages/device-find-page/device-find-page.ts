import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import {BluetoothService} from "../../providers/bluetooth-service";
import {DevicesService} from "../../providers/devices-service";

@IonicPage()
@Component({
    selector: 'page-device-find-page',
    templateUrl: 'device-find-page.html',
})
export class DeviceFindPage {
    status: string = 'Ready';
    devices: any[] = [];

    received: string;

    searchUnpaired = false; // Unsupported yet

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private loadingCtrl: LoadingController,
                private btService: BluetoothService,
                private devicesService: DevicesService) {
        btService.devices$.subscribe(devices => this.devices = devices);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DeviceFindPage');
    }

    ionViewWillLoad() {
        this.list();
    }

    list(refresher = null) {
        /*this.devices = [
         {name: 'Test', address: 'AA:00:0B:20:34:FF'},
         {name: 'H-06', address: 'AA:00:0B:20:34:FF'},
         ];*/

        this.status = '';
        this.btService.list()
            .catch(error => this.status = 'Failed to list devices <br/>' + error)
            .then(() => refresher && refresher.complete());
    }

    connect(d: { name: string, id: string }) {
        let loading = this.loadingCtrl.create();
        loading.present()
            .then(() => this.btService.getSensors(d.id))
            .then(sensors =>
                this.devicesService.saveSensorTypes(sensors))
            .then(() => loading.dismiss())
            .then(() => this.navCtrl.push('SensorTypesPage'));
    }

    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

}
