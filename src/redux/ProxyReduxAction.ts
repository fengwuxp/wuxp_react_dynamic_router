import {Reducer, Store} from "redux";
import {isFunction, isNullOrUndefined, isString, isUndefined} from "util";
import {ReduxAction} from "./ReduxAction";
import {addSagaHandler} from "./SagaManager";
import {SagaHandler} from "./SagaHandler";
import {convertFunctionNameByPrefix} from "./FindNameStragegy";
import {go, goBack, goForward, push, replace, RouterAction} from "react-router-redux";
import {LocationDescriptor, LocationDescriptorObject, LocationState} from "history";
import {stringify} from "querystring";

/*
*
* redux react-redux redux-saga
*
* 期望操作：
*    传入一个处理对象，解析生成对应的 reducer，并且返回一个代理的action(支持同步和异步的操作)
*
* 处理流程：
*
*
* */


/**
 * 默认的 saga action type的后缀
 * @type {string}
 */
export const SAGA_ACTION_TYPE_SUFFIX: string = "__SAGA";


/**
 * 创建一个 redux handler
 * @param {T} handler
 * @return {T}
 */
export function createReduxHandler<T extends SagaHandler>(handler: T): T {

    addSagaHandler(handler);

    const handlerName = handler.constructorName || handler.constructor.name;

    const proxyHandler: ProxyHandler<T> = {

        get(target: T, p: PropertyKey, receiver: any): any {

            return function (...params) {

                let isPureAction = !target[p].generatorFunction;

                //分发
                return proxyDispatchBySaga(`${handlerName}.${p as string}`, params[0], isPureAction);
            }
        },

        set(target: T, p: PropertyKey, value: any, receiver: any): boolean {
            // throw new Error("禁止给handler动态添加方法");
            return true;
        }
    };


    return new Proxy(handler, proxyHandler);

}


/**
 * 是否为一个generator
 * @param {SagaHandler} handler
 * @param handle
 * @return {any}
 */
function isGenerator(handler: SagaHandler, handle: Function) {

    //使用 generatorFunctionNames判断
    // let handleFnName = handle.name;
    // return handler.generatorFunctionNames.some((name => handleFnName === name));

    // const prototype = handle.prototype;
    // if (isNullOrUndefined(prototype)) {
    //     return prototype;
    // }
    // const __proto__ = prototype["__proto__"];
    // if (isNullOrUndefined(__proto__)) {
    //     return false;
    // }
    // //依赖构造函数名称
    // return __proto__ && __proto__.constructor.name === "GeneratorFunctionPrototype";
}


/**
 * 使用新的 state
 * @type {string}
 */
export const USE_NEW_SATE: string = "__USE_NEW_SATE__";

function addAction(actions, handlerName, key, handle, handlerPrototype, handler: SagaHandler) {
    actions[`${handlerName}.${key}`] = handle;
    if (key.startsWith("set")) {
        let getFuncName = convertFunctionNameByPrefix(key);
        if (getFuncName in handlerPrototype) {
            handler.actionNames.set(getFuncName, key);
        }
    }
}

/**
 * 通过一个handler 创建一个reducer
 * @param handler
 * @return {Reducer<S>}
 */
export function createReducerByHandler<S>(handler: SagaHandler): Reducer<S> {

    //获取handler的名称
    const handlerName = handler.constructorName || handler.constructor.name;

    console.log("创建reducer", handlerName, handler['name']);

    const actions = {};

    const defaultState = handler.default;

    if (isNullOrUndefined(handler.actionNames)) {
        handler.actionNames = new Map<string, string>();
    }

    //获取原型链
    const handlerPrototype = Object.getPrototypeOf(handler);

    //获取原型链上的属性名称
    const keys = Object.getOwnPropertyNames(handlerPrototype);

    for (const key in handler) {
        if (key === "actionNames" || key === "default") {
            continue;
        }
        //固有属性
        addAction(actions, handlerName, key, handler[key], handlerPrototype, handler);
    }
    // console.log(keys, handlerPrototype);
    keys.filter(key => key !== "constructor").forEach(key => {
        const handle = handlerPrototype[key];
        if (isNullOrUndefined(handle)) {
            console.log(`${handlerName}的${key} is null`);
            return;
        }
        if (handle.generatorFunction) {
            //跳过 saga 处理者
            console.log("--generator function-->", key)
        } else {
            //action
            addAction(actions, handlerName, key, handle, handlerPrototype, handler);
        }
    });

    // console.info("===============actions-----------", actions);

    //加入到cache中
    return function (state: S = defaultState, action: ReduxAction): S {
        const {type, payload} = action;

        if (type.endsWith(SAGA_ACTION_TYPE_SUFFIX)) {
            //saga的分发
            // console.log("-----------------saga--忽略------------------", type);
            return state;
        }
        let handle = actions[type];

        console.log("-----------接收到一个action----->", type, state, action);

        if (isUndefined(handle)) {
            //action 不存在使用默认的 state
            return state;
        }

        if (handle === USE_NEW_SATE) {
            //总是使用新的state
            return action.payload;
        }

        if (isFunction(handle)) {
            return handle(state, payload);
        }

        return handle;

    }

}

/**
 * 获取reducer action的名称
 * @param {string} type saga 中 action 的名称
 * @return {string}
 */
export function getReducerTypeNameBySaga(type: string) {

    return type.replace(SAGA_ACTION_TYPE_SUFFIX, "")
}

/**
 * 与 getReducerTypeNameBySaga作用相反
 * @param {string} type
 * @return {string}
 */
export function getSagaTypeNameByReducer(type: string) {

    return `${type}${SAGA_ACTION_TYPE_SUFFIX}`;
}

let DEFAULT_STORE: Store<any>;

/**
 * 注册一个store
 * @param {Store<any>} store
 */
export function registerStoreByProxy(store: Store<any>) {

    DEFAULT_STORE = store;
}


/**
 * 代理的 分发器
 * @param {string} type
 * @param {T}payload
 * @param {boolean} pureAction 是否为一个action
 */
function proxyDispatchBySaga<T>(type: string, payload: T, pureAction: boolean): ReduxAction {


    let byReducer;

    if (pureAction) {
        byReducer = type;
    } else {
        byReducer = getSagaTypeNameByReducer(type);
    }
    console.log(`---dispatch--->${byReducer}`);

    return DEFAULT_STORE.dispatch({
        type: byReducer,

        /**
         * payload 用于传输数据
         */
        payload
    });
}

export interface ViewLocationDescriptorObject extends LocationDescriptorObject {

    params?: {};
}

/**
 * 路由持有者
 */
export const routerHandler = {
    push: (location: ViewLocationDescriptorObject | string, state?: LocationState) => {
        if (!isString(location)) {
            location.search = stringify(location.params);
        }
        return DEFAULT_STORE.dispatch(push(location, state))
    },
    replace: (location: LocationDescriptor, state?: LocationState) => DEFAULT_STORE.dispatch(replace(location, state)),
    go: (n: number) => DEFAULT_STORE.dispatch(go(n)),
    goBack: () => DEFAULT_STORE.dispatch(goBack()),
    goForward: () => DEFAULT_STORE.dispatch(goForward()),
};
