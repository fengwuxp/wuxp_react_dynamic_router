import ApiClientFetch from "typescript_api_sdk/src/api/impl/es/ApiClientFetch";
import {DataType} from "typescript_api_sdk/src/api/enums/DataType";
import {AbstractActionResolver} from "./AbstractActionResolver";
import {ActionResp} from "../model/ActionResp";


//fetch
const apiClientFetch = new ApiClientFetch(false);

/**
 * api 请求解析
 */
export default class ApiRequestResolver extends AbstractActionResolver {


    constructor() {
        super();
    }

    /**
     *
     * @param {string} request 请求地址
     * @param prams   请求参数
     * @returns {Promise<any>}
     */
    resolve = (request: string, prams: any): void => {

        apiClientFetch.post({
            url: request,
            data: prams,
            dataType: DataType.JSON
        }).then((resp: ActionResp<any>) => {
            this.dispatchRespHandle(resp, request, prams);
        }).catch((e) => {
            this.exceptionHandler.handle(e)
        });

        return null;
    };

    protected doFailure = (resp: ActionResp<any>): void => {
        console.log("业务逻辑错误-->");
        console.log(resp);
    };


}
