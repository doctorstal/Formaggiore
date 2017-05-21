import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {MediaService} from "../../providers/media-service";

/**
 * Generated class for the MediaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-media-page',
    templateUrl: 'media-page.html',
})
export class MediaPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private mediaService: MediaService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MediaPage');
    }
    removeMedia(id:number) {
        this.mediaService.removeMedia(id);
    }

}
