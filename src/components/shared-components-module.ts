import {NgModule} from "@angular/core";
import {BasicEditForm} from "./basic-edit-form";
import {IonicPageModule} from "ionic-angular";
import {ItemsListComponent} from "./items-list-component";

@NgModule({
    exports: [BasicEditForm, ItemsListComponent],
    imports: [IonicPageModule.forChild(BasicEditForm)],
    declarations: [BasicEditForm, ItemsListComponent]
})
export class SharedComponentsModule {
}
