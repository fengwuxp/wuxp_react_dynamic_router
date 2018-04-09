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
import {History} from "history";


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
let HANDLER_MAP: Map<string, Handler> = null;

/**
 * 初始handler
 * @param {History} navigator
 * @param {Map<string, ActionHandler>} handlerMap
 */
const initHandler = (navigator: History, handlerMap?: Map<string, ActionHandler>) => {
    if (isNullOrUndefined(handlerMap)) {

        //从工厂中获取handler
        const map: Map<string, ActionHandler> = require("../factory/handler/ActionHandlerFactoy").default;

        //设置默认的handler
        const webReactRouteHandler = new WebReactRouteHandler(navigator);
        this.HANDLER_MAP.set(ROUTE_VIEW_HANDLER_NAME, webReactRouteHandler);
        this.HANDLER_MAP.set(EXCEPTION_HANDLER_NAME, new UnifiedExceptionHandler());
        HANDLER_MAP = map;
    } else {
        HANDLER_MAP = handlerMap;
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

    /**
     * 路由处理器
     */
    protected routeHandler: ActionHandler;


    constructor(navigator: History, handlerMap?: Map<string, ActionHandler>) {
        initHandler(navigator, handlerMap);
        this.routeHandler = handlerMap.get(ROUTE_VIEW_HANDLER_NAME);
        this.exceptionHandler = handlerMap.get(EXCEPTION_HANDLER_NAME);
    }

    /**
     * 动作
     * @param {ActionResp<any>} resp
     * @returns {Promise<any>}
     */
    abstract resolve: (...arguments) => void;

    /**
     * 失败处理
     */
    protected abstract doFailure: (...arguments) => void;


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
     * 处理路由
     * @param {ActionConfig} action
     * @param {any} data
     */
    protected handleAction(action: ActionConfig, data: any) {

        //解析规则
        const {type, value, params, promptData, desc} = action;

        if (StringUtils.hasText(type) || type === "view") {
            //视图处理
            this.routeHandler.handle(action, data);

        } else if (type === "action") {
            //操作处理
        } else {
            //自定义
        }

    }


}
