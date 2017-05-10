import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {RecipesPage} from "./recipes-page";

@NgModule({
  declarations: [
    RecipesPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipesPage),
  ],
  exports: [
    RecipesPage
  ]
})
export class RecipesPageModule {}
