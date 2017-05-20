import {Component} from "@angular/core";
import {
    AlertController,
    IonicPage,
    NavController
} from "ionic-angular";
import {UserService} from "../../providers/user-service";

@IonicPage()
@Component({
    selector: 'page-register-page',
    templateUrl: 'register-page.html',
})
export class RegisterPage {

    createSuccess = false;
    registerCredentials = {login: '', password: '', name: ''};

    constructor(private nav: NavController,
                private userService: UserService,
                private alertCtrl: AlertController) {
    }

    public register() {
        this.userService.create(this.registerCredentials).subscribe(success => {
                if (success) {
                    this.createSuccess = true;
                    this.showPopup("Success", "Account created.",
                        () => this.nav.popToRoot());
                } else {
                    this.showPopup("Error", "Problem creating account.");
                }
            },
            error => {
                this.showPopup("Error", error);
            });
    }

    showPopup(title, text, handler?: () => void) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [{
                text: 'OK',
                handler: handler
            }]
        });
        alert.present();
    }

}
