import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {SensorType} from "../protocol/device";
import {
    DB,
    rowsAsArray
} from "./data/database/sqlite.implementation";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class DevicesService {
    sensorTypes$: Subject<SensorType[]>;

    constructor(private db: DB) {
        this.sensorTypes$ = new BehaviorSubject(null);
        db.ready()
            .then(() => this.fetchSensorTypes());
    }

    saveSensorTypes(sensors: SensorType[]): Promise<any> {
        return this.db.transaction(tx =>
                Promise.all(
                    sensors.map(sensor =>
                        tx.executeSql(`INSERT INTO sTypes (token, name, min_value, max_value) 
                          SELECT ?, ?, ?, ? 
                          WHERE NOT EXISTS(SELECT 1 FROM sTypes WHERE token=?)`,
                            [sensor.typeToken, sensor.defaultName, sensor.maxValue, sensor.minValue, sensor.typeToken]))
                )
            )
            .then(()=> this.fetchSensorTypes());
    }

    fetchSensorTypes(): Promise<any> {
        return this.db.transaction(tx =>
            tx.executeSql(`SELECT 
                             token as typeToken, 
                             name as defaultName, 
                             min_value as minValue, 
                             max_value as maxValue FROM sTypes`, [])
        )
            .then(data => rowsAsArray(data))
            .then(sTypes => this.sensorTypes$.next(sTypes));
    }
}
