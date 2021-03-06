import { controller, httpGet, httpPatch, requestBody, httpPost, httpDelete, requestParam } from 'inversify-express-utils';
import { inject } from "inversify";

import TYPES from "../const/types";
import ServiceDiary from "../services/serviceDiary";

import * as API from "../api/main";

@controller(API.Urls.Diary.r(), TYPES.NeedLogin)
export class DiaryController {
    constructor(@inject(TYPES.DiaryService) private drsr: ServiceDiary) {

    }

    @httpGet(API.Urls.Diary.all)
    public getPostList(): Promise<API.APIResponse<API.RespPostList>> {
        return this.drsr.getAllPosts()
        .then( (res) => {
            return {
                result: API.APIResponseResult.OK,
                data: res
            };
        })
        .catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            };
        });
    }

    @httpGet(API.Urls.Diary.post)
    public getAPost(@requestParam("id") id: string): Promise<API.APIResponse<API.RespPost>> {
        return this.drsr.getPostById(id)
        .then( (res) => {
            return {
                result: API.APIResponseResult.OK,
                data: res
            };
        })
        .catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            };
        });
    }

    @httpPost(API.Urls.Diary.all)
    public uploadPost(@requestBody() body: API.Post): Promise<API.APIResponse<API.RespID>> {
        return this.drsr.createNewPost(body)
        .then( (res) => {
            return {
                result: API.APIResponseResult.OK,
                data: res
            };
        })
        .catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            };
        });
    };

    @httpPatch(API.Urls.Diary.post)
    public updatePost(@requestBody() body: API.Post, @requestParam("postId") postId: string): Promise<API.APIResponse<void>> {
        return this.drsr.updatePost(postId, body).then( () => {
            return {
                result: API.APIResponseResult.OK,
                data: null
            }
        }).catch( (err) => {
            return {
                result: API.APIResponseResult.Fail,
                resultDetail: err,
                data: null
            }
        });
    }

    @httpDelete(API.Urls.Diary.post)
    public deletePost(@requestParam("postId") postId: string): Promise<API.APIResponse<void>> {
        return this.drsr.deletePost(postId).then( (ret) => {
            return {
                result: API.APIResponseResult.OK,
                data: null
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