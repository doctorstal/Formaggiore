import {
    DB,
    DBTransaction
} from "./database/sqlite.implementation";


type UpgradeScript = (database: DBTransaction) => Promise<any>;


let list: UpgradeScript[] = [];
// Basic user system
list[0] = transaction => {
    return Promise.resolve()
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS users (
          id            INTEGER PRIMARY KEY,
          name          TEXT,
          login         TEXT NOT NULL,
          password_hash TEXT,
          CONSTRAINT user_login_unique UNIQUE (login)
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS userData (
          user_id INTEGER,
          email   TEXT,
          FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS userSessions (
          id          INTEGER PRIMARY KEY,
          user_id     INTEGER,
          expire_time INTEGER,
          FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))

        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS roles (
          id   INTEGER,
          name TEXT,
          CONSTRAINT role_id_unique UNIQUE (id)
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS userRoles (
          user_id INTEGER,
          role_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (role_id) REFERENCES roles (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
        .then(() => transaction.executeSql(`INSERT INTO roles (id, name)
        VALUES (?, ?)`, [1, 'Manager']))
        .then(() => transaction.executeSql(`INSERT INTO roles (id, name)
        VALUES (?, ?)`, [2, 'Employee']))
        .then(() => transaction.executeSql(`INSERT INTO roles (id, name)
        VALUES (?, ?)`, [3, 'Intern']))
        .then(() => transaction.executeSql(`INSERT INTO users (id, login, name, password_hash)
        VALUES (?, ?, ?, ?)`, [1, 'admin', '', 'f6fdffe48c908deb0f4c3bd36c032e72'])) // Default is admin/admin
        .then(() => transaction.executeSql(`INSERT INTO userRoles (user_id, role_id)
        VALUES (?, ?)`, [1, 1]))
};


list[1] = (transaction: DBTransaction) => {
    return Promise.resolve()
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS recipes (
          id          INTEGER PRIMARY KEY,
          name        TEXT,
          description TEXT
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS recipeSteps
        (
          id          INTEGER PRIMARY KEY,
          recipe      INTEGER,
          step_number INTEGER,
          title       TEXT,
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

list[2] = (transaction: DBTransaction) => {
    return Promise.resolve()
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS userData (
          user_id INTEGER,
          email   TEXT(255)
        )`, []))
};

class UpgradeList {
    constructor(private upgradeScripts: UpgradeScript[]) {
    }

    public upgrade(database: DB): Promise<any> {
        // TODO every upgrade script should run in it's own transaction
        // to do so, we need to wrap version obtaining in it's own tx - find a method to pass data from tx call
        return database.transaction(tx =>
            tx.executeSql(`SELECT version
                           FROM dbVersion`, [])
                .then(
                    (data) => {
                        console.log(JSON.stringify(data));
                        return data.rows.length > 0 ? data.rows.item(0).version : 0;
                    },
                    (error) => tx.executeSql(`CREATE TABLE IF NOT EXISTS dbVersion (
                      version INTEGER
                    )`, []).then(() => {
                        console.log("updating dbversion");
                        console.log(JSON.stringify(database));
                        return tx.executeSql(`INSERT INTO dbVersion (version) VALUES (?)`, [0])
                    })
                        .then(() => 0)
                )
                .then((oldVersion) => {
                    console.log("db at version " + oldVersion);
                    let promise: Promise<any> = Promise.resolve();
                    for (let i = oldVersion; i < this.upgradeScripts.length; i++) {
                        promise = promise
                        // .then(() => database.transaction((transaction)=>this.upgradeScripts[i](transaction)))
                            .then(() => this.upgradeScripts[i](tx))
                            .then(() => {
                                console.log("Upgraded DB to version " + (i + 1));
                                return tx.executeSql(`UPDATE dbVersion
                                SET version = ?`, [i + 1]);
                            });
                    }
                    return promise;
                })
                .then(() => tx.executeSql(`SELECT *
                                           FROM dbversion`, []))
        )
    }
}


export const dbUpgradeList = new UpgradeList(list);
