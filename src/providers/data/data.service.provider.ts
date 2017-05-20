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
import {RecipesService} from "../recipes-service";
import {SQLite} from "@ionic-native/sqlite";
import {KnowledgeService} from "../knowledge-service";
import {DevicesService} from "../devices-service";
import {MediaService} from "../media-service";
import {UserService} from "../user-service";
export const dataServiceProviders: Provider[] = [
    SQLite,
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
    DataService,
    RecipesService,
    KnowledgeService,
    DevicesService,
    MediaService,
    UserService
];
