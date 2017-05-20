import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {KnowledgePage} from "./knowledge-page";
import {SharedComponentsModule} from "../../components/shared-components-module";

@NgModule({
    declarations: [
        KnowledgePage,
    ],
    imports: [
        IonicPageModule.forChild(KnowledgePage),
        SharedComponentsModule
    ],
    exports: [
        KnowledgePage
    ]
})
export class KnowledgePageModule {
}
