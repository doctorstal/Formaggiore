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
import {PLATFORM_READY} from "./app.tokens";
import {dataServiceProviders} from "../providers/data/data.service.provider";
import {AuthService} from "../providers/auth-service";
import {Camera} from "@ionic-native/camera";
import {CameraMock} from "../providers/camera-mock";
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";

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
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AuthService,
        BluetoothSerial,
        {
            provide: Camera, useFactory: (platform: Platform) => {
            return (platform.is('core') || platform.is('mobileweb')) ?
                new CameraMock() :
                new Camera();
            },
            deps: [Platform]
        }
    ]
})
export class AppModule {
}
