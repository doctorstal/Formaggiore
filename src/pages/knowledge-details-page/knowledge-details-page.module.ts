import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {KnowledgeDetailsPage} from "./knowledge-details-page";

@NgModule({
  declarations: [
    KnowledgeDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(KnowledgeDetailsPage),
  ],
  exports: [
    KnowledgeDetailsPage
  ]
})
export class KnowledgeDetailsPageModule {}
