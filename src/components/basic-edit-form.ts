import {
    Component,
    EventEmitter,
    Input,
    Output
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators
} from "@angular/forms";

@Component({
    selector: 'basic-edit-form',
    template: `
        <div>
            <form [formGroup]="form">
                <ion-list no-lines>
                    <ion-item class="first">
                        <ion-label floating>Title</ion-label>
                        <ion-input type="text" formControlName="name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label floating>Description</ion-label>
                        <ion-textarea formControlName="description"></ion-textarea>
                    </ion-item>
                    <ng-content></ng-content>
                </ion-list>
            </form>
            <ion-list>
                <ion-item>
                    <button ion-button type="button" (click)="cancel.emit()">Cancel</button>
                    <button ion-button type="submit" (click)="submit.emit(form.value)"
                            [disabled]="!form.valid">Save
                    </button>
                </ion-item>
            </ion-list>
        </div>
    `
})
export class BasicEditForm {
    form: FormGroup;

    @Input() set details(value: { name: string, description: string, id: number }) {
        this.form.patchValue({name: value.name, description: value.description, id: value.id});
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() submit: EventEmitter<any> = new EventEmitter();

    constructor(formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            id: 0
        });
    }
}
