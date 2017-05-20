import {
    Component,
    Inject,
    ViewChild
} from "@angular/core";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {DataService} from "../providers/data/data.service";
import {PLATFORM_READY} from "./app.tokens";
import {
    LoadingController,
    Nav
} from "ionic-angular";
import {AuthService} from "../providers/auth-service";
import {User} from "../providers/data/datatypes";
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = 'HomePage';

    pages: Array<{ title: string, page: string }> = [
        {title: 'Users', page: 'UsersPage'},
        {title: 'Recipes', page: 'RecipesPage'},
        {title: 'Knowledge base', page: 'KnowledgePage'},
        {title: 'Media', page: 'MediaPage'},
        {title: 'Devices', page: 'DevicesPage'},
    ];

    user:User;

    constructor(@Inject(PLATFORM_READY) private ready: Promise<void>,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                private loadingCtrl: LoadingController,
                private database: DataService, // Just to be sure that DS was initialized
                private authService: AuthService) {
        ready.then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            authService.currentUser$.subscribe(user=>this.user = user);
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.page);
    }

    goToLogin() {
        this.nav.setRoot('LoginPage');
    }
    logout() {
        let loading = this.loadingCtrl.create();
        loading.present().then(() =>
            this.authService.logout()
                .subscribe(() => loading.dismiss())
        );
    }

}

