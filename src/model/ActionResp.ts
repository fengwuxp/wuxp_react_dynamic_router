import {ApiResp} from "typescript_api_sdk/src/api/model/ApiResp";
import {ActionConfig} from "./ActionConfig";


/**
 * 统一动作响应
 */
export interface ActionResp<T> extends ApiResp<T> {


    /**
     * 动作列表，大于1时供用户做出选择
     */
    actions: ActionConfig[];
}
