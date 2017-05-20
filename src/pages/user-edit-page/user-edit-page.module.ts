import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {UserEditPage} from "./user-edit-page";

@NgModule({
  declarations: [
    UserEditPage,
  ],
  imports: [
    IonicPageModule.forChild(UserEditPage),
  ],
  exports: [
    UserEditPage
  ]
})
export class UserEditPageModule {}
