import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {CreateRecipePage} from "./create-recipe-page";

@NgModule({
  declarations: [
    CreateRecipePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateRecipePage),
  ],
  exports: [
    CreateRecipePage
  ]
})
export class CreateRecipePageModule {}
