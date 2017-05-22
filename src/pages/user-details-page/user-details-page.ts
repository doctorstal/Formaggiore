import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {UserDetails} from "../../providers/data/datatypes";
import {UserService} from "../../providers/user-service";

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

    user: UserDetails;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private userService: UserService) {
        this.user = navParams.data;
    }

    ionViewWillEnter() {
        this.userService.getUserDetails(this.user.id)
            .subscribe(userDetails => this.user = userDetails)
    }

}
