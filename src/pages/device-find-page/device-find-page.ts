import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";

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


    constructor(public navCtrl: NavController, public navParams: NavParams, private bt: BluetoothSerial) {
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
        this.bt.isEnabled()
            .catch(() => this.bt.enable())
            .then(() => this.bt.list())
            .then(devices => this.devices = devices)
            .catch(error => this.status = 'Failed to list devices <br/>' + error)
            .then(() => refresher && refresher.complete());
    }

    connect(d: { name: string, id: string}) {
        this.bt.connect(d.id)
            .flatMap(() =>this.bt.subscribeRawData())
            .subscribe(data => this.received += new Uint8Array(data));
    }

}
