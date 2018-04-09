import {ActionResolver} from "./ActionResolver";
import {ActionConfig} from "../model/ActionConfig";
import {PromptType} from "../enums/PromptType";
import {isNullOrUndefined} from "util";
import StringUtils from "typescript_api_sdk/src/utils/StringUtils";
import {ActionHandler} from "../handler/action/ActionHandler";
import {ActionResp} from "../model/ActionResp";
import {Handler} from "../handler/Handler";
import UnifiedExceptionHandler from "../handler/execption/UnifiedExceptionHandler";
import WebReactRouteHandler from "../handler/action/WebReactRouteHandler";
import {ExceptionHandler} from "../handler/execption/ExceptionHandler";


/**
 * 视图路由处理者名称
 * @type {string}
 */
export const ROUTE_VIEW_HANDLER_NAME = "ROUTE_VIEW_HANDLER_NAME";

/**
 *异常处理
 * @type {string}
 */
export const EXCEPTION_HANDLER_NAME = "EXCEPTION_HANDLER_NAME";


/**
 * 动作处理map
 */
let handlerMap: Map<string, Handler> = null;

const initHandler = (reactProps: any, handlerMap?: Map<string, ActionHandler>) => {
    if (isNullOrUndefined(handlerMap)) {
        const map: Map<string, ActionHandler> = require("../factory/ActionHandlerFactoy").default;
        //设置默认的handler
        this.handlerMap.set(ROUTE_VIEW_HANDLER_NAME, new WebReactRouteHandler(reactProps.history));
        this.handlerMap.set(EXCEPTION_HANDLER_NAME, new UnifiedExceptionHandler(reactProps.history));
        handlerMap = map;
    } else {
        handlerMap = handlerMap;
    }
};

/**
 * 抽象的动作解析
 */
export abstract class AbstractActionResolver implements ActionResolver<any> {

    /**
     * 异常处理器
     */
    protected exceptionHandler: ExceptionHandler;

    protected routerHandler: ActionHandler;


    constructor(reactProps: any, handlerMap?: Map<string, ActionHandler>) {
        initHandler(reactProps, handlerMap);
        this.routerHandler = handlerMap.get(ROUTE_VIEW_HANDLER_NAME);
        this.exceptionHandler = handlerMap.get(EXCEPTION_HANDLER_NAME);
    }

    /**
     * 动作
     * @param {ActionResp<any>} resp
     * @returns {Promise<any>}
     */
    abstract resolve: (...arguments) => Promise<any>;


    protected dispatchResp(resp: ActionResp<any>) {
        const {actions, data, success} = resp;
        if (!success) {
            //处理失败
            this.doFailure(resp)
        } else {
            let length = actions.length;

            if (length === 0) {

            } else if (length === 1) {

            } else {

            }
        }
    }


    /**
     * 失败处理
     */
    protected abstract doFailure: (...arguments) => void;


    /**
     * 处理路由
     * @param {ActionConfig} action
     * @param {any} data
     */
    protected handleAction(action: ActionConfig, data: any) {

        //解析规则
        const {type, value, params, promptData, desc} = action;

        if (StringUtils.hasText(type) || type === "view") {
            //视图解析
            this.routerHandler.handle(action, data);

        } else if (type === "action") {
            //操作处理
        } else {
            //自定义
        }

    }


}
