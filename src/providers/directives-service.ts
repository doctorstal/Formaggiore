import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {DB} from "./data/database/sqlite.implementation";

@Injectable()
export class DirectiveService {

  constructor(public db: DB) {
    console.log('Hello DirectiveService Provider');
  }

}
