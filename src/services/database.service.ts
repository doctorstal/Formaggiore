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

@Injectable()
export class DatabaseService {
    static readonly DATABASE_CONFIG: SQLiteDatabaseConfig = {name: 'main.db', location: 'default'};
    private database: SQLiteObject;

    constructor(private sqlite: SQLite, private errorHandler: ErrorHandler, platform: Platform) {
        platform.ready().then(() => {
            this.connect();
        }).catch(this.errorHandler.handleError);
    }


    private connect() {
        this.sqlite.create(DatabaseService.DATABASE_CONFIG)
            .then(this.setDatabase)
            .then(this.createTablesStructure)
            .catch(this.errorHandler.handleError);
    }

    private setDatabase(database: SQLiteObject): SQLiteObject {
        this.database = database;
        return database;
    }

    private createTablesStructure(database: SQLiteObject):SQLiteObject {
        return database;
    }
}
