import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {StepEditPage} from "./step-edit-page";
import {SharedComponentsModule} from "../../components/shared-components-module";
import {DirectiveEditComponent} from "./directive-edit-component";

@NgModule({
    declarations: [
        StepEditPage,
        DirectiveEditComponent,
    ],
    imports: [
        IonicPageModule.forChild(StepEditPage),
        SharedComponentsModule
    ],
    exports: [
        StepEditPage
    ]
})
export class StepEditPageModule {
}
