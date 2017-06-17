import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SensorTypesPage} from "./sensor-types-page";

@NgModule({
  declarations: [
    SensorTypesPage,
  ],
  imports: [
    IonicPageModule.forChild(SensorTypesPage),
  ],
  exports: [
    SensorTypesPage
  ]
})
export class SensorTypesPageModule {}
