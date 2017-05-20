import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {MediaPage} from "./media-page";

@NgModule({
  declarations: [
    MediaPage,
  ],
  imports: [
    IonicPageModule.forChild(MediaPage),
  ],
  exports: [
    MediaPage
  ]
})
export class MediaPageModule {}
