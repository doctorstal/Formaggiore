import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/operator/mergeMap";
import "rxjs/operator/repeat";
import {Media} from "./data/datatypes";
import {Observable} from "rxjs/Observable";
import {DB} from "./data/database/sqlite.implementation";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class MediaService {

    media$: Subject<Media[]>;


    constructor(private db: DB) {
        this.media$ = new BehaviorSubject(null);
        this.getMedia().subscribe(media => this.media$.next(media));
    }

    getMedia(): Observable<Media[]> {
        return Observable.create(observable => {
            this.db.transaction(tx => tx.executeSql(`SELECT
                                                       id,
                                                       type_id AS type,
                                                       content
                                                     FROM medias`, []))
                .then(data => {
                    console.log(data);
                    let media: Media[] = [];
                    for (let i = 0; i < data.rows.length; i++) {
                        media.push({...data.rows.item(0)});
                    }
                    return media;
                })
                .then(media => observable.next(media))
                .then(() => observable.complete())
        });
    }

    removeMedia(id: number) {
        this.db.transaction(tx =>
            tx.executeSql(`DELETE FROM medias
            WHERE id = ?`, [id])
                .then(() => tx.executeSql(`DELETE FROM stepMedias
                WHERE media_id = ?`, [id]))
        )
            .then(() => this.getMedia().subscribe(media => this.media$.next(media)));

    }

}
