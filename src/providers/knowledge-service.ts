import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Knowledge} from "./data/datatypes";
import {Observable} from "rxjs/Observable";
import {
    DB,
    rowsAsArray
} from "./data/database/sqlite.implementation";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class KnowledgeService {
    private knowledge: BehaviorSubject<Knowledge[]> = new BehaviorSubject([]);
    knowledge$: Observable<Knowledge[]>;

    constructor(public db: DB) {
        this.knowledge$ = this.knowledge.asObservable();
        this.knowledge$.subscribe(console.log.bind(null, "Knowledge: "));
        this.fetchData();
    }

    private fetchData() {
        return this.db.transaction(tx => tx.executeSql(`SELECT *
                                                 FROM knowledges`, []))
            .then(data => rowsAsArray(data))
            .then(users => this.knowledge.next(users));
    }

    create(value: Knowledge): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(
                        `INSERT INTO knowledges (name, description) VALUES (?, ?)`,
                    [value.name, value.description]
                )
            )
                .then(this.fetchData.bind(this))
                .then(() => true)
        )

    }

    save(item: Knowledge): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(
                    `UPDATE knowledges SET name=?, description=? WHERE id=?`,
                    [item.name, item.description, item.id]
                )
            )
                .then(this.fetchData.bind(this))
                .then(() => true)
        )
    }

    deleteItem(item: Knowledge): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(
                    `DELETE FROM knowledges WHERE id=?`,
                    [item.id]
                )
            )
                .then(this.fetchData.bind(this))
                .then(() => true)
        );
    }
}
