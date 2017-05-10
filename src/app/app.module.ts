import {BrowserModule} from "@angular/platform-browser";
import {
    ErrorHandler,
    NgModule
} from "@angular/core";
import {
    IonicApp,
    IonicErrorHandler,
    IonicModule,
    Platform
} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";

import {MyApp} from "./app.component";
import {SQLite} from "@ionic-native/sqlite";
import {PLATFORM_READY} from "./app.tokens";
import {dataServiceProviders} from "../services/data.service.provider";
import {AuthService} from "../providers/auth-service";

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        {provide: PLATFORM_READY, useFactory: (platform) => platform.ready(), deps: [Platform]},
        ...dataServiceProviders,
        SQLite,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AuthService
    ]
})
export class AppModule {
}
