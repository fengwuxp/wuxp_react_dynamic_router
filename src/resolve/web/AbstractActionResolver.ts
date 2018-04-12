import {ActionResolver} from "../ActionResolver";
import {ActionConfig} from "../../model/ActionConfig";
import {PromptType} from "../../enums/PromptType";
import {isNullOrUndefined} from "util";
import StringUtils from "typescript_api_sdk/src/utils/StringUtils";
import {ActionHandler} from "../../handler/action/ActionHandler";
import {ActionResp} from "../../model/ActionResp";
import {Handler} from "../../handler/Handler";
import WebHttpExceptionHandler from "../../handler/execption/WebHttpExceptionHandler";
import WebReactRouteHandler from "../../handler/action/WebReactRouteHandler";
import {HttpExceptionHandler} from "../../handler/execption/HttpExceptionHandler";
import {History} from "history";
import browserNavigatorFactory from "../../factory/navigator/web/BrowseRNavigatorFactory";


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
const initHandler = (navigator: History, handlerMap?: Map<string, Handler>) => {
    if (isNullOrUndefined(handlerMap)) {

        //从配置中获取handler
        const map = require("../../../../src/config/ActionHandlerConfig").default;

        //设置默认的handler
        //路由处理
        map.set(ROUTE_VIEW_HANDLER_NAME, new WebReactRouteHandler(navigator));

        //异常处理
        map.set(EXCEPTION_HANDLER_NAME, new WebHttpExceptionHandler(navigator));
        HANDLER_MAP = map;
        console.log(map);
    } else {
        HANDLER_MAP = handlerMap;
    }
};

/**
 * 抽象的动作解析
 */
export abstract class AbstractActionResolver implements ActionResolver {

    /**
     * 异常处理器
     */
    protected exceptionHandler: HttpExceptionHandler;

    /**
     * 路由处理器
     */
    protected routeHandler: ActionHandler;


    constructor(navigator?: History, handlerMap?: Map<string, ActionHandler>) {
        if (isNullOrUndefined(navigator)) {
            navigator = browserNavigatorFactory.get();
        }
        initHandler(navigator, handlerMap);
        this.routeHandler = HANDLER_MAP.get(ROUTE_VIEW_HANDLER_NAME);
        this.exceptionHandler = <HttpExceptionHandler>HANDLER_MAP.get(EXCEPTION_HANDLER_NAME);
    }

    /**
     * 动作
     * @param {ActionResp<any>} resp
     * @returns {Promise<any>}
     */
    abstract resolve: (...params) => void;

    /**
     * 失败处理
     */
    protected abstract doFailure: (...params) => void;


    /**
     * 分发结果处理
     * @param {ActionResp<any>} resp
     * @param {string} request
     * @param prams
     */
    protected dispatchRespHandle(resp: ActionResp<any>, request: string, prams: any) {
        const {actions, data, success} = resp;
        if (!success) {
            //处理失败
            this.doFailure(resp);
            return;
        }

        let length: number = actions.length;

        if (length === 0) {
            //没有任何动作，直接跳转
            this.routeHandler.handle({
                value: request,
                prams
            });
        } else if (length === 1) {
            //有一个
            this.handleAction(actions[0], data);
        } else {
            //多个
            console.log("有多个动作需要处理");

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

        if (isNullOrUndefined(type) || type.length === 0 || type === "view") {
            //视图处理
            this.routeHandler.handle(action, data);

        } else if (type === "action") {
            //TODO 操作处理

        } else {
            //自定义
            const handler = HANDLER_MAP.get(type);
            if (isNullOrUndefined(handler)) {
                console.error("不支持的动作类型-> " + type);
                return;
            }
            handler.handle(action, data);
        }

    }


}
