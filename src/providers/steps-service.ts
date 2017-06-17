import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {
    DB,
    firstRowAsObject,
    rowsAsArray
} from "./data/database/sqlite.implementation";
import {Observable} from "rxjs/Observable";
import {
    Media,
    SensorDirective,
    Step,
    StepDetails
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

    getStepDetails(step_id: number): Observable<StepDetails> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                Promise.all([
                    tx.executeSql(`SELECT
                                     id,
                                     name,
                                     description
                                   FROM steps
                                   WHERE id = ?`, [step_id]),
                    tx.executeSql(`SELECT
                                     m.id      AS id,
                                     m.content AS content,
                                     m.type_id AS type
                                   FROM steps AS s
                                     JOIN stepMedias ON s.id = stepMedias.step_id
                                     JOIN medias AS m ON stepMedias.media_id = m.id
                                   WHERE s.id = ?`, [step_id]),
                    tx.executeSql(`SELECT
                                     d.id          AS id,
                                     d.start_value AS startValue,
                                     d.end_value   AS endValue,
                                     d.time        AS time,
                                     st.token      AS sTypeToken
                                   FROM stepDirectives AS sd
                                     JOIN directives AS d ON sd.directive_id = d.id
                                     LEFT JOIN sTypes AS st ON d.stype_id = st.id
                                   WHERE sd.step_id = ?`, [step_id])
                ]))
                .then(arr => {
                    let stepDetails: StepDetails = firstRowAsObject(arr[0]);
                    if (stepDetails) {
                        stepDetails.media = rowsAsArray(arr[1]);
                        stepDetails.directive = firstRowAsObject(arr[2]);
                    }
                    return stepDetails;
                })
        );
    }

    saveDirective(step_id: number, value: SensorDirective): Observable<boolean> {
        return Observable.fromPromise(
            this.db.transaction(tx =>
                tx.executeSql(
                        `SELECT directive_id
                         FROM stepDirectives
                         WHERE step_id = ?`, [step_id]
                )
                    .then(data => (data.rows.length > 0)
                        ? tx.executeSql(`UPDATE directives
                            SET stype_id  = (SELECT id
                                             FROM sTypes
                                             WHERE token = ?),
                              start_value = ?,
                              end_value   = ?,
                              time        = ?
                            WHERE id = ?`,
                            [value.sTypeToken, value.startValue, value.endValue, value.time, data.rows.item(0).directive_id])
                        : tx.executeSql(`INSERT INTO directives (stype_id, start_value, end_value, time)
                            VALUES ((SELECT id
                                     FROM sTypes
                                     WHERE token = ?), ?, ?, ?)`,
                            [value.sTypeToken, value.startValue, value.endValue, value.time])
                            .then(insertData => tx.executeSql(`INSERT INTO stepDirectives (step_id, directive_id)
                                VALUES (?, ?)`,
                                [step_id, insertData.insertId])
                            )
                    )
            )
                .then(() => true)
        );
    }
}
