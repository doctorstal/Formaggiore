import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";

/**
 * Generated class for the UserDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-details-page',
  templateUrl: 'user-details-page.html',
})
export class UserDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailsPage');
  }

}
