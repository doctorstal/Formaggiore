import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from "@angular/core";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/debounceTime";

@Component({
    selector: 'items-list',
    template: `
        <ion-list>
            <ion-list-header *ngIf="search">
                <ion-searchbar #searchInput></ion-searchbar>
            </ion-list-header>
            <ion-item-sliding *ngFor="let item of filteredItems">
                <button ion-item (click)="openItem.emit(item)">
                    {{item.name}}
                </button>
                <ion-item-options side="right" icon-left>
                    <button ion-button color="edit" (click)="editItem.emit(item)">
                        <ion-icon name="create"></ion-icon>
                        Edit
                    </button>
                </ion-item-options>
                <ion-item-options side="left" icon-left>
                    <button ion-button color="delete" (click)="deleteItem.emit(item)">
                        <ion-icon name="trash"></ion-icon>
                        Delete
                    </button>
                </ion-item-options>
            </ion-item-sliding>
        </ion-list>

        <ion-card *ngIf="inlineCreate">
            <ion-item>
                <ion-label floating>{{inlineCreate}}</ion-label>
                <ion-input type="text" [(ngModel)]="newItemTitle"></ion-input>
            </ion-item>
            <button type="button" block ion-button icon-only
                    (click)="createInlineItem.emit(newItemTitle); newItemTitle='';">
                <ion-icon name="add"></ion-icon>
            </button>
        </ion-card>
        <ion-fab right bottom *ngIf="!inlineCreate">
            <button color="create" ion-fab (click)="createItem.emit()">
                <ion-icon name="add"></ion-icon>
            </button>
        </ion-fab>
    `
})
export class ItemsListComponent {
    @Input() search: boolean;

    private originalItems: any[];
    private filteredItems: any[];
    private itemsIndexedContent: string[];

    @Input() set items(value: any[]) {
        this.originalItems = value;
        this.filteredItems = value;
        this.itemsIndexedContent = value.map(item =>
            Object.keys(item).reduce((prev, key) =>
                prev + '\n' +
                key + ':' + String(item[key]).toLowerCase(),
                '')
        )
    }


    @Input() inlineCreate: string;
    @Output() openItem: EventEmitter<any> = new EventEmitter();
    @Output() editItem: EventEmitter<any> = new EventEmitter();
    @Output() deleteItem: EventEmitter<any> = new EventEmitter();
    @Output() createItem: EventEmitter<any> = new EventEmitter();
    @Output() createInlineItem: EventEmitter<string> = new EventEmitter();

    private newItemTitle: string;

    @ViewChild('searchInput') set searchInput(searchInput) {
        if (searchInput)
            searchInput.ionChange
                .map(input => input.value)
                .distinctUntilChanged()
                .debounceTime(300)
                .subscribe(value =>
                    this.filterItems(value));
    }

    filterItems(search: string) {
        let searchString = search.toLowerCase();
        this.filteredItems = this.originalItems.filter((_, i) =>
        this.itemsIndexedContent[i].indexOf(searchString) > -1)
    }

}
