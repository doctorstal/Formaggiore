import {Component} from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import {
    Role,
    UserDetails
} from "../../providers/data/datatypes";
import {UserService} from "../../providers/user-service";
import {
    FormBuilder,
    FormGroup
} from "@angular/forms";
import {isUndefined} from "ionic-angular/util/util";

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
    user: UserDetails;
    form: FormGroup;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private fb: FormBuilder,
                private userService: UserService) {
        if (isUndefined(navParams.data.id)) {
            navCtrl.setRoot('UsersPage');
        }
            this.user = navParams.data;
            this.form = fb.group({
                login: [{value:this.user.login, disabled:true}],
                name: this.user.name,
                email: this.user.email,
                role: '1',
                role2: ''
            });

    }

    ionViewWillEnter() {
        // TODO get details is overkill - we need only user with role here
        this.userService.getUserDetails(this.user.id)
            .filter(userDetails => userDetails != undefined)
            .subscribe(userDetails => {
                console.log("User details obtained: ",userDetails);
                this.user = userDetails;
                this.form.patchValue({...userDetails, role: userDetails.role || Role.INTERN});
            })
    }

    ionChange(event) {
        console.log(event);
    }

    saveUser(formValue: { name: string, email: string, role: Role }) {
        this.user = {...this.user, ...formValue};
        console.log('saving', this.user);
        this.userService.save(this.user);
    }

    resetPassword() {

    }

}
