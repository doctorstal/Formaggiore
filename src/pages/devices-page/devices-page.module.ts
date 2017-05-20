import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {DevicesPage} from "./devices-page";

@NgModule({
  declarations: [
    DevicesPage,
  ],
  imports: [
    IonicPageModule.forChild(DevicesPage),
  ],
  exports: [
    DevicesPage
  ]
})
export class DevicesPageModule {}
