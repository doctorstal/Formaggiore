import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {DirectiveCreatePage} from "./directive-create-page";

@NgModule({
  declarations: [
    DirectiveCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DirectiveCreatePage),
  ],
  exports: [
    DirectiveCreatePage
  ]
})
export class DirectiveCreatePageModule {}
