import {DataService} from "../services/data.service";
import {
    Inject,
    Injectable
} from "@angular/core";
import {PLATFORM_READY} from "../app/app.tokens";

@Injectable()
export class DataServiceWeb implements DataService {
    constructor(@Inject(PLATFORM_READY) ready: Promise<void>) {
        ready.then(() => {
            console.log("READY!");
        });


    }

}
