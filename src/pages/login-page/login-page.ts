import {Component} from "@angular/core";
import {
    AlertController,
    IonicPage,
    Loading,
    LoadingController,
    NavController
} from "ionic-angular";
import {AuthService} from "../../providers/auth-service";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-login-page',
    templateUrl: 'login-page.html',
})
export class LoginPage {
    loading: Loading;
    registerCredentials = {login: '', password: ''};

    constructor(private nav: NavController,
                private auth: AuthService,
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController) {
    }


    public login() {
        this.showLoading().then(() => {
            this.auth.login(this.registerCredentials).subscribe(allowed => {
                    if (allowed) {
                        this.loading.dismiss()
                            .then(() => {
                                return this.nav.setRoot('HomePage');
                            });
                    } else {
                        this.showError("Access Denied!");
                    }
                },
                error => {
                    this.showError(error);
                });
        });
    }

    showLoading(): Promise<any> {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        return this.loading.present();
    }

    showError(text) {
        this.loading.dismiss()
            .then(() => {
                let alert = this.alertCtrl.create({
                    title: 'Fail',
                    subTitle: text,
                    buttons: ['OK']
                });
                return alert.present(prompt);
            })
            .catch(console.error);
    }

}
