import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {DeviceFindPage} from "./device-find-page";

@NgModule({
  declarations: [
    DeviceFindPage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceFindPage),
  ],
  exports: [
    DeviceFindPage
  ]
})
export class DeviceFindPageModule {}
