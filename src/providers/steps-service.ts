import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {
    DB,
    rowsAsArray
} from "./data/database/sqlite.implementation";
import {Observable} from "rxjs/Observable";
import {
    Media,
    Step
} from "./data/datatypes";

@Injectable()
export class StepsService {

    constructor(public db: DB) {


    }


    deleteStep(step: Step): Observable<boolean> {
        return this.deleteMediaForStep(step.id)
            .flatMap(() => this.db.transaction(tx =>
                tx.executeSql(`DELETE FROM steps
                    WHERE id = ?`,
                    [step.id]))
                .then(() => true)
                .catch(console.log)
            )
    }

    saveStepTitleAndDescription(step): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(`UPDATE steps
                SET name = ?, description = ?
                WHERE id = ?`, [step.name, step.description, step.id])
            )
                .then(console.log.bind(this, "SAVE STEP RESULT: "))
                .then(() => true)
        )
    }

    addStepMedia(step: Step, media: Media): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(`INSERT INTO medias (type_id, content)
                VALUES (?, ?)`, [media.type, media.content])
                    .then(data => tx.executeSql(`INSERT INTO stepMedias (media_id, step_id)
                    VALUES (?, ?)`, [data.insertId, step.id]))
            )
                .then(() => true)
        );
    }

    removeStepMedia(step: Step, media: Media): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(`DELETE FROM medias
                WHERE id = ?`, [media.id])
                    .then(() => tx.executeSql(`DELETE FROM stepMedias
                    WHERE step_id = ? AND media_id = ?`, [step.id, media.id]))
            ).then(() => true)
        )
    }


    deleteMediaForStep(step_id: number): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(`DELETE FROM medias
                WHERE id IN (SELECT media_id
                             FROM stepMedias
                             WHERE step_id = ?)`, [step_id])
                    .then(() => tx.executeSql(`DELETE FROM stepMedias
                    WHERE step_id = ?`, [step_id]))
            )
                .then(() => true)
                .catch(console.log.bind(this, "DELETE MEDIA FOR STEP ERROR: "))
        )
    }

    getStepMedia(step_id: number): Observable<Media[]> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(`SELECT
                                 medias.id,
                                 medias.content,
                                 medias.type_id AS type
                               FROM medias
                                 JOIN stepMedias ON medias.id = stepMedias.media_id
                               WHERE stepMedias.step_id = ?`, [step_id])
            )
                .then(data => rowsAsArray(data))
        );
    }
}
