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
          CONSTRAINT users_login_unique UNIQUE (login)
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS userData (
          user_id INTEGER,
          email   TEXT,
          FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          CONSTRAINT userdata_user_id_unique UNIQUE (user_id)
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
        VALUES (?, ?, ?, ?)`, [1, 'admin', 'Admin', 'f6fdffe48c908deb0f4c3bd36c032e72'])) // Default is admin/admin
        .then(() => transaction.executeSql(`INSERT INTO userRoles (user_id, role_id)
        VALUES (?, ?)`, [1, 1]))
};

// Recipes and steps
list[1] = (transaction: DBTransaction) => {
    return Promise.resolve()
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS recipes (
          id          INTEGER PRIMARY KEY,
          name        TEXT,
          description TEXT
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS steps (
          id          INTEGER PRIMARY KEY,
          step_number INTEGER,
          name        TEXT,
          description TEXT,
          recipe_id   INTEGER,
          FOREIGN KEY (recipe_id) REFERENCES recipes (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS recipeAuthors (
          user_id   INTEGER,
          recipe_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (recipe_id) REFERENCES recipes (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS completedRecipes (
          user_id   INTEGER,
          recipe_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (recipe_id) REFERENCES recipes (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
};

// Media types
list[2] = (transaction: DBTransaction) => {
    return Promise.resolve()
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS mediaTypes (
          id   INTEGER PRIMARY KEY,
          name TEXT
        )`, []))
        .then(() => transaction.executeSql(`INSERT INTO mediaTypes (id, name)
        VALUES (?, ?)`, [1, "Photo"]))
        .then(() => transaction.executeSql(`INSERT INTO mediaTypes (id, name)
        VALUES (?, ?)`, [2, "Video"]))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS medias (
          id      INTEGER PRIMARY KEY,
          type_id INTEGER,
          content BLOB,
          FOREIGN KEY (type_id) REFERENCES mediaTypes (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS recipeMedias (
          media_id  INTEGER,
          recipe_id INTEGER,
          FOREIGN KEY (media_id) REFERENCES medias (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (recipe_id) REFERENCES recipes (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS stepMedias (
          media_id INTEGER,
          step_id  INTEGER,
          FOREIGN KEY (media_id) REFERENCES medias (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (step_id) REFERENCES steps (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
};

// Knowledge
list[3] = (transaction: DBTransaction) => {
    return Promise.resolve()
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS topics (
          id   INTEGER PRIMARY KEY,
          name TEXT
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS knowledges (
          id          INTEGER PRIMARY KEY,
          name        TEXT,
          description TEXT
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS knowledgeTopics (
          knowledge_id INTEGER,
          topic_id     INTEGER,
          FOREIGN KEY (knowledge_id) REFERENCES knowledges (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (topic_id) REFERENCES topics (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS stepKnowledges (
          knowledge_id INTEGER,
          step_id      INTEGER,
          FOREIGN KEY (knowledge_id) REFERENCES knowledges (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (step_id) REFERENCES steps (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS recipeKnowledges (
          knowledge_id INTEGER,
          recipe_id    INTEGER,
          FOREIGN KEY (knowledge_id) REFERENCES knowledges (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (recipe_id) REFERENCES recipes (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
};

// Devices
list[4] = (transaction: DBTransaction) => {
    return Promise.resolve()
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS devices (
          id       INTEGER PRIMARY KEY,
          name     TEXT,
          bt_token TEXT
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS sTypes (
          id        INTEGER PRIMARY KEY,
          token     TEXT,
          name      TEXT,
          min_value INTEGER,
          max_value INTEGER
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS deviceSensors (
          id        INTEGER PRIMARY KEY,
          device_id INTEGER,
          stype_id  INTEGER,
          FOREIGN KEY (device_id) REFERENCES devices (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (stype_id) REFERENCES sTypes (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
};

// Directives
list[5] = (transaction: DBTransaction) => {
    return Promise.resolve()
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS directives (
          id          INTEGER PRIMARY KEY,
          stype_id    INTEGER,
          start_value INTEGER,
          end_value   INTEGER,
          time        INTEGER,
          FOREIGN KEY (stype_id) REFERENCES sTypes (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`, []))
        .then(() => transaction.executeSql(`CREATE TABLE IF NOT EXISTS stepDirectives (
          step_id      INTEGER,
          directive_id INTEGER,
          FOREIGN KEY (step_id) REFERENCES steps (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          FOREIGN KEY (directive_id) REFERENCES directives (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
          CONSTRAINT stepDirectives_directive_id_unique UNIQUE (directive_id)
        )`, []))
}

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
