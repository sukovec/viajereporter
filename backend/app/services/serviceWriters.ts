import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import TYPES from "../const/types";
import db from "./db";
import * as API from "../common/ifaces";

let provideSingleton = function(identifier: any) { return fluentProvide(identifier).inSingletonScope().done(); };

@provideSingleton(TYPES.WritersService)
export default class WritersService { 
    constructor(@inject(TYPES.database) private database: db) {
    }

    public getWritersList(): Promise<API.Writer[]> {
        return new Promise( (res, rej) => {
            this.database.writers.find({}, (err: any, doc: API.Writer[]) => {
                if (err) return rej(err);

                res(doc);
            });
        });
    }

    public getWriterById(id: String): Promise<API.Writer> {
        return new Promise( (res, rej) => {
            this.database.writers.find({_id: id}, (err: any, doc: API.Writer) => {
                if (err) return rej(err);
                if (!doc) return rej(new Error("The document was not found"));
                res(doc);
            });
        });
    }

    public addNewWriter(writer: API.Writer): Promise<string> {
        return new Promise( (res, rej) => {
            this.database.writers.insert(writer, (err: any, doc: API.Writer) => {
                if (err) return rej(err);
                
                res(doc._id);
            });
        });
    }
}