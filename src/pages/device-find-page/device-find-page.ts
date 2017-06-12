import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {BluetoothService} from "../../providers/bluetooth-service";

/**
 * Generated class for the DeviceFindPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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


    constructor(public navCtrl: NavController, public navParams: NavParams, private btService: BluetoothService) {
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

    connect(d: { name: string, id: string}) {
        this.btService.connect(d.id);
        this.btService.rawData$
            .do(data=> console.log(data))
            .subscribe(data => this.received += this.ab2str(data));
    }

    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

}
