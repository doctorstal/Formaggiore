import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {KnowledgeService} from "../../providers/knowledge-service";
import {Knowledge} from "../../providers/data/datatypes";

/**
 * Generated class for the KnowledgePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-knowledge-page',
  templateUrl: 'knowledge-page.html',
})
export class KnowledgePage {

  knowledge:Knowledge[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private knowledgeService: KnowledgeService) {
    knowledgeService.knowledge$
        .subscribe(data => this.knowledge = data);
  }

  deleteItem(item: Knowledge) {
    this.knowledgeService.deleteItem(item).subscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KnowledgePage');
  }

}
