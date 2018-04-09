import ApiClientFetch from "typescript_api_sdk/src/api/impl/es/ApiClientFetch";
import {DataType} from "typescript_api_sdk/src/api/enums/DataType";
import {AbstractActionResolver, EXCEPTION_HANDLER_NAME, ROUTE_VIEW_HANDLER_NAME} from "./AbstractActionResolver";
import {ActionResp} from "../model/ActionResp";


const apiClientFetch = new ApiClientFetch(false);

/**
 * api 请求解析
 */
export default class ApiRequestResolver extends AbstractActionResolver {


    constructor(props: any) {
        super(props);
    }

    /**
     *
     * @param {string} request 请求地址
     * @param prams   请求参数
     * @returns {Promise<any>}
     */
    resolve = (request: string, prams: any): Promise<any> => {

        apiClientFetch.post({
            url: request,
            data: prams,
            dataType: DataType.JSON
        }).then((resp: ActionResp<any>) => {
            this.dispatchResp(resp);
        }).catch((e) => {
            this.exceptionHandler.handle(e)
        });

        return null;
    };
    protected doFailure: (...arguments) => void;


}
