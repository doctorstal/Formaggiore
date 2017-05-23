import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/operator/mergeMap";
import "rxjs/operator/repeat";
import {Media} from "./data/datatypes";
import {Observable} from "rxjs/Observable";
import {
    DB,
    rowsAsArray
} from "./data/database/sqlite.implementation";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class MediaService {

    media$: Subject<Media[]>;

    constructor(private db: DB) {
        this.media$ = new BehaviorSubject(null);
        this.fetchMedia();
    }

    fetchMedia(): Observable<void> {
        return Observable.fromPromise (
            this.db.transaction(tx => tx.executeSql(`SELECT
                                                       id,
                                                       type_id AS type,
                                                       content
                                                     FROM medias`, []))
                .then(data => rowsAsArray(data))
                .then(media => this.media$.next(media))
        );
    }

    removeMedia(id: number) {
        this.db.transaction(tx =>
            tx.executeSql(`DELETE FROM medias
            WHERE id = ?`, [id])
                .then(() => tx.executeSql(`DELETE FROM stepMedias
                WHERE media_id = ?`, [id]))
        )
            .then(() => this.fetchMedia());
    }

}
