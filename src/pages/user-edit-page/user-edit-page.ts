import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";

/**
 * Generated class for the UserEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-edit-page',
  templateUrl: 'user-edit-page.html',
})
export class UserEditPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserEditPage');
  }

}
