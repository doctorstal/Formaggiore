import {
    Component,
    OnInit
} from "@angular/core";
import {
    LoadingController,
    NavParams
} from "ionic-angular";
import {SensorDirective} from "../../../providers/data/datatypes";
import {BluetoothService} from "../../../providers/bluetooth-service";
@Component({
    template: `
        <ion-list>
            <ion-item text-wrap>
                Choose a device with {{ directive.sTypeName }} ({{ directive.sTypeToken }}) sensor.
            </ion-item>
            <button ion-item *ngFor="let d of devices" (click)="connect(d)">
                <ion-icon item-left name="bluetooth"></ion-icon>
                <h2>{{ d.name }}</h2>
                <p>{{ d.id }}</p>
            </button>
            <ion-item *ngIf="error">Error: {{ error }}</ion-item>
        </ion-list>
    `
})
export class ChooseDevicePopover implements OnInit {
    private directive: SensorDirective;
    private startCallback: (deviceId: string) => void;

    devices: any[] = [];
    error: string;
    constructor(private navParams: NavParams,
                private btService: BluetoothService,
                private loadingCtrl: LoadingController) {
        btService.devices$.subscribe(devices => this.devices = devices);
        this.error = "";
        let loading = loadingCtrl.create();
        loading
            .present()
            .then(() => btService.list())
            .catch(error => this.error = error)
            .then(() => loading.dismiss())
    }

    connect(device) {
        // TODO connect to device and send execute request. Now just callback to start timer on recipes page
        let loading = this.loadingCtrl.create();
        loading
            .present()
            .then(() => this.btService.sendDirective(device.id, this.directive))
            .catch(error => this.error = error)
            .then(() => loading.dismiss())
            .then(() => this.startCallback(device.id));
    }


    ngOnInit(): void {
        if (this.navParams.data) {
            this.directive = this.navParams.data.directive;
            this.startCallback = this.navParams.data.startCallback;
        }
    }
}
