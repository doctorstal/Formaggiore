import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {
    Markup,
    Messages,
    SensorType
} from "../protocol/device";


@Injectable()
export class BluetoothService {
    private HANDSHAKE_MESSAGE: number[] = [Markup.MESSAGE_START, Messages.HANDSHAKE, Markup.MESSAGE_END];

    public devices$: BehaviorSubject<any[]> = new BehaviorSubject(null);
    public rawData$: Observable<any>;
    private subscription: Subscription;

    constructor(public bt: BluetoothSerial) {
    }

    list(): Promise<boolean> {
        /*this.devices = [
         {name: 'Test', address: 'AA:00:0B:20:34:FF'},
         {name: 'H-06', address: 'AA:00:0B:20:34:FF'},
         ];*/

        return this.bt.isEnabled()
            .catch(() => this.bt.enable())
            .then(() => this.bt.list())
            .then(devices => this.devices$.next(devices))
            .then(() => true);
    }

    isConnected(): Promise<any> {
        return this.bt.isConnected();
    }

    connect(id: string) {
        this.disconnect();
        let connectable:Observable<any> = this.bt.connect(id)
            .retry(5)
            .do(() => this.sendHandshake())
            .flatMap(() => this.bt.subscribeRawData())
            .map(data => String.fromCharCode.apply(null, new Uint8Array(data)))
            .share();

        this.rawData$ = connectable
            .buffer(connectable.debounceTime(100))
            .map(arr => "".concat(...arr))
            .share();

        this.subscription = this.rawData$
            .subscribe(data => this.parseRawData(data));

    }

    disconnect() {
        this.subscription && this.subscription.unsubscribe();

    }

    sendHandshake() {
        this.isConnected()
            .then(() => this.write(this.HANDSHAKE_MESSAGE));
    }

    write(data) {
        console.log(data);
        return this.bt.write(data);
    }

    parseRawData(data) {
        console.log("RAW DATA:");
        console.log(data);

    }

    getSensors(deviceId: string):Promise<SensorType[]> {
        return Promise.resolve(
            [new SensorType("c820201f-99d3-4e70-b4b1-c5b10ff15acf", "Induction Heater", 0, 100)]
        );
    }
}
