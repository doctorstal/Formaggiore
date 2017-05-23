import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {MediaService} from "../../providers/media-service";
import {Media} from "../../providers/data/datatypes";

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
    media: Media[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private mediaService: MediaService) {
        mediaService.media$
            .subscribe(media => this.media = media);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MediaPage');
    }

    removeMedia(id: number) {
        this.mediaService.removeMedia(id);
    }

}
