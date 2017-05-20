import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {RecipeEditPage} from "./recipe-edit-page";
import {SharedComponentsModule} from "../../components/shared-components-module";

@NgModule({
    declarations: [
        RecipeEditPage,
    ],
    imports: [
        IonicPageModule.forChild(RecipeEditPage),
        SharedComponentsModule,
    ],
    exports: [
        RecipeEditPage
    ]
})
export class RecipeEditPageModule {
}
