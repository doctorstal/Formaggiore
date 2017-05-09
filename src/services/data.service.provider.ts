import {DataServiceWeb} from "./data.service.web";
import {
    DataService,
    DataServiceImpl
} from "./data.service";
import {
    Injector,
    Provider
} from "@angular/core";
import {Platform} from "ionic-angular";
export const dataServiceProviders: Provider[] = [
    DataServiceImpl,
    DataServiceWeb,
    {
        provide: DataService,
        useFactory: (platform: Platform, injector: Injector) => {
            return (platform.is('core') || platform.is('mobileweb')) ?
                injector.get(DataServiceWeb) :
                injector.get(DataServiceImpl);
        },
        deps: [Platform, Injector]
    }];
