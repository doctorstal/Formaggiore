import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {RecipesPage} from "./recipes-page";
import {SharedComponentsModule} from "../../components/shared-components-module";

@NgModule({
    declarations: [
        RecipesPage,
    ],
    imports: [
        IonicPageModule.forChild(RecipesPage),
        SharedComponentsModule
    ],
    exports: [
        RecipesPage
    ]
})
export class RecipesPageModule {
}
