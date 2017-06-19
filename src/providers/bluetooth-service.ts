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
import {Platform} from "ionic-angular";
import {SensorDirective} from "./data/datatypes";


@Injectable()
export class BluetoothService {

    public devices$: BehaviorSubject<any[]> = new BehaviorSubject(null);
    public rawData$: Observable<any>;
    private subscription: Subscription;

    constructor(public bt: BluetoothSerial, private platform: Platform) {
    }

    list(): Promise<boolean> {
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            this.devices$.next([
                {name: 'Test', address: 'AA:00:0B:20:34:FF'},
                {name: 'H-06', address: 'AA:00:0B:20:34:FF'},
            ]);
        }

        return this.bt.isEnabled()
            .catch(() => this.bt.enable())
            .then(() => this.bt.list())
            .then(devices => this.devices$.next(devices))
            .then(() => true);
    }

    isConnected(): Promise<any> {
        return this.bt.isConnected();
    }

    connect(id: string): Promise<any> {
        this.disconnect();
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {

            let connectable: Observable<any> = this.bt.connect(id)
                .retry(5)
                .catch(error => {
                    reject(error);
                    return Observable.throw(error)
                })
                .do(() => resolve())
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

        })

    }

    disconnect() {
        this.subscription && this.subscription.unsubscribe();

    }

    sendHandshake() {
        this.isConnected()
            .then(() => this.sendMessage(Messages.HANDSHAKE, ''));
    }

    sendMessage(type: Messages, body: string): Promise<any> {
        return this.bt.write('' + Markup.MESSAGE_START + type + body + Markup.MESSAGE_END);
    }

    parseRawData(data) {
        console.log("RAW DATA:");
        console.log(data);

    }

    getSensors(deviceId: string): Promise<SensorType[]> {
        return this.connect(deviceId)
            .then(() =>
                [new SensorType("c820201f-99d3-4e70-b4b1-c5b10ff15acf", "Induction Heater", 0, 100)]
            );
    }

    sendDirective(deviceId: string, directive: SensorDirective): Promise<any> {
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            return Promise.resolve();
        } else {
            return this.connect(deviceId)
                .then(() =>
                    this.sendMessage(Messages.DIRECTIVE,
                        [0, directive.startValue, directive.endValue, directive.time]
                            .map(c => String.fromCharCode(c + 48))
                            .join('')
                    )
                )
        }
    }
}
