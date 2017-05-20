import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import {KnowledgeService} from "../../providers/knowledge-service";
import {Observable} from "rxjs/Observable";
import {Knowledge} from "../../providers/data/datatypes";

/**
 * Generated class for the KnowledgeEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-knowledge-edit-page',
  templateUrl: 'knowledge-edit-page.html',
})
export class KnowledgeEditPage {

  private details:Knowledge;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private service: KnowledgeService) {
    this.details = navParams.data;
  }

  save(value) {
    let loading = this.loadingCtrl.create({content:'Saving', dismissOnPageChange:true});
    Observable.fromPromise(loading.present())
        .flatMap(() => this.service.save(value))
        .flatMap(success =>
            loading.dismiss()
                .then(() => this.navCtrl.pop())
        ).subscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KnowledgeEditPage');
  }

}
