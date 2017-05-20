import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {StepCreatePage} from "./step-create-page";
import {SharedComponentsModule} from "../../components/shared-components-module";

@NgModule({
    declarations: [
        StepCreatePage
    ],
    imports: [
        IonicPageModule.forChild(StepCreatePage),
        SharedComponentsModule,
    ],
    exports: [
        StepCreatePage
    ]
})
export class StepCreatePageModule {
}
