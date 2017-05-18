import {DataService} from "./data.service";
import {
    Injector,
    Provider
} from "@angular/core";
import {Platform} from "ionic-angular";
import {
    DB,
    NativeDB,
    WebDB
} from "./database/sqlite.implementation";
export const dataServiceProviders: Provider[] = [
    WebDB,
    NativeDB,
    {
        provide: DB,
        useFactory: (platform: Platform, injector: Injector) => {
            return (platform.is('core') || platform.is('mobileweb')) ?
                injector.get(WebDB) :
                injector.get(NativeDB);
        },
        deps: [Platform, Injector]
    },
    DataService
];
