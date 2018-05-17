import {ReduxAction} from "./ReduxReducer";
import {Reducer, Store} from "redux";
import {isNullOrUndefined, isObject} from "util";


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


export function createReduxHandler<T extends object=object>(handler: T): T {

    const handlerName = handler.constructor.name;

    const proxyHandler: ProxyHandler<T> = {

        get(target: T, p: PropertyKey, receiver: any): any {

            return function (...params) {

                //分发到saga
                proxyDispatchBySaga(`${handlerName}.${p}`, params[0]);
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
 * 通过一个handler 创建一个reducer
 * @param handler
 * @return {Reducer<S>}
 */
export function createReducerByHandler<S>(handler): Reducer<S> {

    const handlerName = handler.constructor.name;

    console.log("创建reducer", handlerName);

    return function (state: S, action: ReduxAction): S {

        const {type, payload} = action;

        if (isNullOrUndefined(state)) {
            //如果是初始化
            return handler.default;
        }

        const methodName = type.split(".")[1];
        console.log("methodName ", methodName);
        if (methodName in handler) {
            console.log("reducer ", type, payload);
            //如果请求处理的key不存在
            // throw new Error(`${handlerName} 中不存在 type = ${type} 的处理`);
            if (!isObject(state)) {
                //不是对象类型
                return payload;
            }
            return {
                ...state as any,
                ...payload
            } as S;
        } else {
            console.warn(`${handlerName} 中不存在 type = ${type} 的处理`, state);
            return handler.default;
        }


    }

}

export function getReducerTypeNameBySaga(type: string) {

    return type.replace(SAGA_ACTION_TYPE_SUFFIX, "")
}

export function getSagaTypeNameByReducer(type: string) {

    return `${type}${SAGA_ACTION_TYPE_SUFFIX}`;
}

let DEFAULT_STORE;

export function registerStoreByProxy(store: Store<any>) {

    DEFAULT_STORE = store;
}

/**
 * 代理的 分发器
 * @param {string} type
 * @param payload
 * @param {Store<any>} store
 */
function proxyDispatchBySaga(type: string, payload: any) {


    console.log(`dispatch-->${getSagaTypeNameByReducer(type)}`, payload);

    DEFAULT_STORE.dispatch({
        type: getSagaTypeNameByReducer(type),

        /**
         * payload 用于传输数据
         */
        payload
    });
}

