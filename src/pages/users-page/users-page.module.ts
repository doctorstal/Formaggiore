import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {UsersPage} from "./users-page";
import {SharedComponentsModule} from "../../components/shared-components-module";

@NgModule({
  declarations: [
    UsersPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersPage),
      SharedComponentsModule
  ],
  exports: [
    UsersPage
  ]
})
export class UsersPageModule {}
