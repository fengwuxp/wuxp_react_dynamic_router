import ApiClientFetch from "typescript_api_sdk/src/api/impl/es/ApiClientFetch";
import {DataType} from "typescript_api_sdk/src/api/enums/DataType";
import {AbstractActionResolver} from "./AbstractActionResolver";
import {ActionResp} from "../../model/admin/ActionResp";
import message from 'antd/lib/message';


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

    };

    protected doFailure = (resp: ActionResp<any>): void => {
        console.log("业务逻辑错误-->");
        console.log(resp);
        const {code} = resp;

        switch (code) {

            case 99:
                //会话超时
                message.info("会话超时，请重新登录！", 2000, () => {
                    this.exceptionHandler.handle401();
                });
                break;
            default:
                console.log("-----------");
        }

    };


}
