import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {KnowledgeCreatePage} from "./knowledge-create-page";
import {SharedComponentsModule} from "../../components/shared-components-module";

@NgModule({
    declarations: [
        KnowledgeCreatePage,
    ],
    imports: [
        IonicPageModule.forChild(KnowledgeCreatePage),
        SharedComponentsModule
    ],
    exports: [
        KnowledgeCreatePage
    ]
})
export class KnowledgeCreatePageModule {
}
