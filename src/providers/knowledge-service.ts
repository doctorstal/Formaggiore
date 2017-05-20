import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Knowledge} from "./data/datatypes";
import {Observable} from "rxjs/Observable";
import {DB} from "./data/database/sqlite.implementation";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class KnowledgeService {
    private knowledge: BehaviorSubject<Knowledge[]> = new BehaviorSubject([
        {id: 0, name: 'Did you know?', description: 'Your princes is in another castle'}
    ]);
    private nextId:number = 1;
    knowledge$: Observable<Knowledge[]>;

    constructor(public db: DB) {
        this.knowledge$ = this.knowledge.asObservable();
        this.knowledge$.subscribe(console.log.bind(null,"Knowledge: "));
    }

    create(value: Knowledge): Observable<boolean> {
        return Observable.create(observer => {
            this.knowledge.next([...this.knowledge.getValue(), {...value, id:this.nextId++}]);
            observer.next(true);
            observer.complete();
        });

    }

    save(item: Knowledge): Observable<boolean> {
        return Observable.create(observer => {
            this.knowledge.next(
                this.knowledge.getValue()
                    .map(itemInList => itemInList.id == item.id ? item : itemInList));
            observer.next(true);
            observer.complete();
        });
    }

    deleteItem(item: Knowledge): Observable<boolean> {
        return Observable.create(observer => {
            this.knowledge.next(
                this.knowledge.getValue()
                    .filter(itemInList => itemInList.id != item.id));
            observer.next(true);
            observer.complete();
        });
    }
}
