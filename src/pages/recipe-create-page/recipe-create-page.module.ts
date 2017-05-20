import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {RecipeCreatePage} from "./recipe-create-page";
import {SharedComponentsModule} from "../../components/shared-components-module";

@NgModule({
    declarations: [
        RecipeCreatePage
    ],
    imports: [
        IonicPageModule.forChild(RecipeCreatePage),
        SharedComponentsModule
    ],
    exports: [
        RecipeCreatePage
    ]
})
export class RecipeCreatePageModule {
}
