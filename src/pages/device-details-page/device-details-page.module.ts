import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {DeviceDetailsPage} from "./device-details-page";

@NgModule({
  declarations: [
    DeviceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceDetailsPage),
  ],
  exports: [
    DeviceDetailsPage
  ]
})
export class DeviceDetailsPageModule {}
