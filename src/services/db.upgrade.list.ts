import {SQLiteObject} from "@ionic-native/sqlite";


type UpgradeScript = (database: SQLiteObject) => Promise<any>;


let list: UpgradeScript[] = [];
list[0] = transaction => {
    return transaction.executeSql(`CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY,
      name          TEXT(128),
      login         TEXT(64),
      password_hash TEXT(128)
    )`, []);

};


list[1] = (transaction: SQLiteObject) => {
    return transaction.executeSql(`CREATE TABLE IF NOT EXISTS recipes (
      id   INTEGER PRIMARY KEY,
      name TEXT(255)
    )`, [])
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS recipeSteps
        (
          id          INTEGER PRIMARY KEY,
          recipe      INTEGER,
          step_number INTEGER,
          title       TEXT(255),
          FOREIGN KEY (recipe) REFERENCES recipes (id)
        )
        `, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS recipeDescriptions (
          id          INTEGER PRIMARY KEY,
          step        INTEGER,
          description TEXT,
          FOREIGN KEY (step) REFERENCES recipeSteps (id)
        )`, []))
};

class UpgradeList {
    constructor(private upgradeScripts: UpgradeScript[]) {
    }

    public upgrade(database: SQLiteObject): Promise<SQLiteObject> {
        return database.executeSql(`SELECT version
                                    FROM dbVersion`, [])
            .then(
                (data) => {
                    console.log(JSON.stringify(data));
                    return data.rows.length > 0 ? data.rows.item(0).version : 0;
                },
                (error) => database.executeSql(`CREATE TABLE IF NOT EXISTS dbVersion (
                  version INTEGER
                )`, []).then(() => {
                    console.log("updating dbversion");
                    console.log(JSON.stringify(database));
                    return database.executeSql(`INSERT INTO dbVersion (version) VALUES (?)`, [0])
                })
                    .then(() => 0)
            )
            .then((oldVersion) => {
                console.log("db at version " + oldVersion);
                let promise: Promise<any> = Promise.resolve();
                for (let i = oldVersion; i < this.upgradeScripts.length; i++) {
                    promise = promise
                    // .then(() => database.transaction((transaction)=>this.upgradeScripts[i](transaction)))
                        .then(() => this.upgradeScripts[i](database))
                        .then(() => {
                            console.log("Upgraded DB to version " + (i + 1));
                            return database.executeSql(`UPDATE dbVersion
                            SET version = ?`, [i + 1]);
                        });
                }
                return promise;
            })
            .then(() => database.executeSql(`SELECT *
                                             FROM dbversion`, []))

            .then(() => database); // return original SQLLite object to chain db calls
    }
}


export const dbUpgradeList = new UpgradeList(list);
