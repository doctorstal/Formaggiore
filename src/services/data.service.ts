import {
    ErrorHandler,
    Inject,
    Injectable
} from "@angular/core";
import {
    SQLite,
    SQLiteDatabaseConfig,
    SQLiteObject
} from "@ionic-native/sqlite";
import {dbUpgradeList} from "./db.upgrade.list";
import {PLATFORM_READY} from "../app/app.tokens";

@Injectable()
export class DataServiceImpl implements DataService{
    private static readonly DATABASE_CONFIG: SQLiteDatabaseConfig = {name: 'main.db', location: 'default'};
    private database: SQLiteObject;

    constructor(private sqlite: SQLite, private errorHandler: ErrorHandler, @Inject(PLATFORM_READY) ready:Promise<void>) {
        ready
            .then(() => this.connect())
            .then(database => this.updateTablesStructure(database))
            .catch(error => {
                errorHandler.handleError("Error while creating database structure\n" + JSON.stringify(error));
            });
    }


    private connect(): Promise<SQLiteObject> {
        return this.sqlite.create(DataServiceImpl.DATABASE_CONFIG)
            .then(database => this.setDatabase(database))
    }

    private setDatabase(database: SQLiteObject): Promise<SQLiteObject> {
        this.database = database;
        return Promise.resolve(database);
    }

    private updateTablesStructure(database: SQLiteObject): Promise<SQLiteObject> {
        return dbUpgradeList.upgrade(database);
    }
}

export class DataService {

}


