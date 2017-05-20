import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController,
    NavParams
} from "ionic-angular";
import {Knowledge} from "../../providers/data/datatypes";
import {KnowledgeService} from "../../providers/knowledge-service";
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
    selector: 'page-knowledge-create-page',
    templateUrl: 'knowledge-create-page.html',
})
export class KnowledgeCreatePage {

    constructor(private loadingCtrl: LoadingController,
                private knowledgeService: KnowledgeService,
                public navCtrl: NavController,
                public navParams: NavParams) {
    }

    createItem(value: Knowledge) {
        let loading = this.loadingCtrl.create({content: 'Saving'});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.knowledgeService.create(value))
            .flatMap(success => loading.dismiss())
            .subscribe(() => this.navCtrl.pop());
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad KnowledgeCreatePage');
    }

}
