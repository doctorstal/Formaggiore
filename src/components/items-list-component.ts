import {
    Component,
    EventEmitter,
    Input,
    Output
} from "@angular/core";
@Component({
    selector:'items-list',
    template:`
        <ion-list>
            <ion-item-sliding *ngFor="let item of items">
                <button ion-item (click)="openItem.emit(item)">
                    {{item.name}}
                </button>
                <ion-item-options>
                    <button ion-button color="success" (click)="editItem.emit(item)">
                        <ion-icon name="create"></ion-icon>
                        Edit
                    </button>
                    <button ion-button color="danger" (click)="deleteItem.emit(item)">
                        <ion-icon name="remove-circle"></ion-icon>
                        Delete
                    </button>
                </ion-item-options>
            </ion-item-sliding>
        </ion-list>
        <ion-fab right bottom>
            <button color="create" ion-fab (click)="createItem.emit()">
                <ion-icon name="document"></ion-icon>
            </button>
        </ion-fab>
        `
})
export class ItemsListComponent {
    @Input() items;
    @Output() openItem:EventEmitter<any> = new EventEmitter();
    @Output() editItem:EventEmitter<any> = new EventEmitter();
    @Output() deleteItem:EventEmitter<any> = new EventEmitter();
    @Output() createItem:EventEmitter<any> = new EventEmitter();
}
