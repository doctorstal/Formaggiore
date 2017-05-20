import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {Knowledge} from "../../providers/data/datatypes";

/**
 * Generated class for the KnowledgeDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-knowledge-details-page',
  templateUrl: 'knowledge-details-page.html',
})
export class KnowledgeDetailsPage {

  details:Knowledge;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.details = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KnowledgeDetailsPage');
  }

}
