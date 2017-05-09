import {
  Component,
  Inject
} from "@angular/core";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {HomePage} from "../pages/home/home";
import {DataService} from "../services/data.service";
import {PLATFORM_READY} from "./app.tokens";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(@Inject(PLATFORM_READY) ready:Promise<void>, statusBar: StatusBar, splashScreen: SplashScreen, private database: DataService) {
    ready.then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

