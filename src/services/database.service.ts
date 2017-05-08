import {
    ErrorHandler,
    Injectable
} from "@angular/core";
import {
    SQLite,
    SQLiteDatabaseConfig,
    SQLiteObject
} from "@ionic-native/sqlite";
import {Platform} from "ionic-angular";
import {dbUpgradeList} from "./db.upgrade.list";

@Injectable()
export class DatabaseService {
    static readonly DATABASE_CONFIG: SQLiteDatabaseConfig = {name: 'main.db', location: 'default'};
    private database: SQLiteObject;

    constructor(private sqlite: SQLite, private errorHandler: ErrorHandler, platform: Platform) {
        platform.ready()
            .then(() => this.connect())
            .then(database => this.updateTablesStructure(database))
            .catch(error => {
                errorHandler.handleError("Error while creating database structure\n" + JSON.stringify(error));
            });
    }


    private connect(): Promise<SQLiteObject> {
        return this.sqlite.create(DatabaseService.DATABASE_CONFIG)
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


