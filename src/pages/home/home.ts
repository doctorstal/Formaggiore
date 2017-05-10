import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    NavController
} from "ionic-angular";
import {AuthService} from "../../providers/auth-service";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    constructor(private authService: AuthService,
                private loadingCtrl: LoadingController,
                private nav: NavController) {
    }

    public logout() {
        let loading = this.loadingCtrl.create();
        loading.present().then(() =>
            this.authService.logout()
                .subscribe(() => loading.dismiss())
        );

    }

}
