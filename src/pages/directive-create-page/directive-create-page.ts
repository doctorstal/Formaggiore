import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";

/**
 * Generated class for the DirectiveCreatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-directive-create-page',
  templateUrl: 'directive-create-page.html',
})
export class DirectiveCreatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectiveCreatePage');
  }

}
