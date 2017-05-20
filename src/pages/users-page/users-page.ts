import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {User} from "../../providers/data/datatypes";
import {UserService} from "../../providers/user-service";

@IonicPage()
@Component({
    selector: 'page-users-page',
    templateUrl: 'users-page.html',
})
export class UsersPage {


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private userService: UserService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UsersPage');
    }

    deleteItem(user: User) {
        this.userService.deleteItem(user).subscribe();
    }

}
