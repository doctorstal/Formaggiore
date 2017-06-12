import {
    ErrorHandler,
    Injectable
} from "@angular/core";
import {dbUpgradeList} from "./db.upgrade.list";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/mergeMap";
import {DB} from "./database/sqlite.implementation";

@Injectable()
export class DataService {


    constructor(private db: DB,
                private errorHandler: ErrorHandler) {
        db.ready()
            .then(() => db.transaction(tx => tx.executeSql(
                "PRAGMA FOREIGN_KEYS = ON",
                [])))
            .then(() => this.updateTablesStructure())
            .catch(error => {
                console.log(error);
                errorHandler.handleError("Error while creating database structure\n" + JSON.stringify(error));
            });
    }



    private updateTablesStructure(): Promise<any> {
        return dbUpgradeList.upgrade(this.db);
    }
}




