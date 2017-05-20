import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {KnowledgeEditPage} from "./knowledge-edit-page";
import {SharedComponentsModule} from "../../components/shared-components-module";

@NgModule({
  declarations: [
    KnowledgeEditPage,
  ],
  imports: [
    IonicPageModule.forChild(KnowledgeEditPage),
      SharedComponentsModule
  ],
  exports: [
    KnowledgeEditPage
  ]
})
export class KnowledgeEditPageModule {}
