import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";
import {SensorType} from "../../protocol/device";
import {SensorDirective} from "../../providers/data/datatypes";

@Component({
    selector: `directive-edit`,
    template: `
        <ion-list>
            <ion-item>
                <ion-icon name="thermometer" item-left></ion-icon>
                Step directive:
            </ion-item>
            <ion-item>
                <ion-label floating>Sensor type</ion-label>
                <ion-select [(ngModel)]="sType" name="sType" (ionChange)="onChange()">
                    <ion-option *ngFor="let st of sensorTypes" [value]="st">
                        {{ st.defaultName }}
                    </ion-option>
                </ion-select>
            </ion-item>
            <ion-item>
                <ion-label stacked>Start value&nbsp;
                    <ng-container *ngIf="model.startValue">({{model.startValue}})</ng-container>
                </ion-label>
                <ion-range
                        [disabled]="!sType"
                        pin="true"
                        [(ngModel)]="model.startValue"
                        min="sType?.minValue"
                        max="sType?.maxValue"
                        debounce="500"
                        (ionChange)="onChange()"></ion-range>
            </ion-item>
            <ion-item>
                <ion-label stacked>End value&nbsp;
                    <ng-container *ngIf="model.endValue">({{model.endValue}})</ng-container>
                </ion-label>
                <ion-range
                        [disabled]="!sType"
                        pin="true"
                        [(ngModel)]="model.endValue"
                        min="sType?.minValue"
                        max="sType?.maxValue"
                        debounce="500"
                        (ionChange)="onChange()"></ion-range>
            </ion-item>
            <ion-item>
                <ion-label stacked>Time&nbsp;
                    <ng-container *ngIf="model.time">({{model.time}} minutes)</ng-container>
                </ion-label>
                <ion-range
                        [disabled]="!sType"
                        pin="true"
                        [(ngModel)]="model.time"
                        min="0"
                        max="180"
                        debounce="500"
                        (ionChange)="onChange()"></ion-range>
            </ion-item>
            <ion-item>
                Only one directive can be added per step.
            </ion-item>
        </ion-list>
    `
})
export class DirectiveEditComponent implements OnInit {
    @Output() change = new EventEmitter();

    @Input() model: SensorDirective;
    @Input() sensorTypes: SensorType[];

    private sType: SensorType;

    getDirective(): SensorDirective {
        return {
            ...this.model,
            sTypeToken: this.sType.typeToken
        };
    }

    onChange() {
        this.change.emit(this.getDirective());
    }

    ngOnInit(): void {
        this.sType = this.sensorTypes.find(st => st.typeToken == this.model.sTypeToken);
    }
}
