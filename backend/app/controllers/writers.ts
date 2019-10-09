import { controller, httpGet, requestBody, httpPost, requestParam } from 'inversify-express-utils';
import { inject } from "inversify";

import TYPES from "../const/types";
import ServiceWriters from "../services/serviceWriters";

import * as API from "../common/ifaces";

@controller('/api/diary')
export class WritersController {
    constructor(@inject(TYPES.WritersService) private wrtsrv: ServiceWriters) {

    }

    @httpGet("/")
    public getWritersList(): Promise<API.APIResponse<API.RespWriterList>> {
        return this.wrtsrv.getWritersList().then( (ret) => {
            return {
                result: API.APIResponseResult.OK,
                data: ret
            }
        }).catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }

    @httpGet("/:writerId")
    public getWriterById(@requestParam("id") id: string): Promise<API.APIResponse<API.RespWriter>> {
        return this.wrtsrv.getWriterById(id).then( (ret) => {
            return {
                result: API.APIResponseResult.OK,
                data: ret
            }
        }).catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }

    @httpPost("/")
    public createNewWriter(@requestBody() body: API.Writer): Promise<API.APIResponse<API.RespID>> {
        return this.wrtsrv.addNewWriter(body).then( (ret) => {
            return {
                result: API.APIResponseResult.OK,
                data: ret
            }
        }).catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }
}