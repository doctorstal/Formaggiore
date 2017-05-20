import {NgModule} from "@angular/core";
import {BasicEditForm} from "./basic-edit-form";
import {IonicPageModule} from "ionic-angular";
import {ItemsListComponent} from "./items-list-component";
import {ElasticModule} from "angular2-elastic";

@NgModule({
    exports: [BasicEditForm, ItemsListComponent],
    imports: [IonicPageModule.forChild(BasicEditForm), ElasticModule],
    declarations: [BasicEditForm, ItemsListComponent]
})
export class SharedComponentsModule {
}
