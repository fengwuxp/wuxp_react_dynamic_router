import {isFunction, isNullOrUndefined} from "util";
import {Store} from "redux";

/**
 * redux action 工厂
 * @param {T|any} action
 * @param {Store<any>} store
 * @returns {T}
 * @constructor
 */
export function reduxActionFactory<T extends object>(action: T | any, store: Store<any>): T {
    const ActionProxyHandler: ProxyHandler<T> = {
        get: function (target: any, prop: PropertyKey, receiver: any): any {

            /**
             * @param params 调用action的参数
             */
            return function (params: any) {
                proxyDispatchByStore(target, prop.toString(), params, store);
            }
        },
        set: function (target, key, value, receiver): boolean {
            throw new Error("不允许添加新的属性或方法！");
        }
    };
    return new Proxy(action, ActionProxyHandler);
}

/**
 * 通过代理生成 管理者 对象
 * @param manager T
 * @param reduxAction
 * @param store
 * @returns {object}
 */
export function reduxManagerFactory<T extends object>(manager: T, reduxAction: any, store: Store<any>): T {


    const SagaProxyHandler: ProxyHandler<T> = {
        get: function (target: any, prop: PropertyKey, receiver: any): any {

            /**
             * @param prams  调用action的参数
             */
            return function (params) {
                // console.log(prop);
                // console.log(reduxAction)
                if (Reflect.has(reduxAction, prop)) {
                    //调用 action中的方法
                    // console.log(`action manager-> ${prop}`);
                    return reduxAction[prop](params);
                } else {
                    // console.log(`saga manager-> ${prop}`);
                    let propName: string = target.constructor.name + "." + prop.toString();
                    // console.log(`${propName}`);
                    proxyDispatchByStore(target, propName, params, store);
                }
            }
        },
        set: function (target, key, value, receiver): boolean {
            throw new Error("不允许添加新的属性或方法！");
        }
    };
    return new Proxy(manager, SagaProxyHandler);
}

/**
 * 代理的 分发器
 * @param target
 * @param {string} prop
 * @param params
 * @param {Store<any>} store
 */
function proxyDispatchByStore(target: any, prop: string, params, store: Store<any>) {

    let element = target[prop];
    if (isNullOrUndefined(element)) {
        element = params;
    } else if (isFunction(element)) {
        element = element(params);
    }

    if (isNullOrUndefined(element)) {
        element = params;
    }
    store.dispatch({
        type: prop,
        /**
         * payload 用于传输数据
         */
        payload: element
    });
}

/**
 * 创建一个 redux handler 对象
 * @param {S} manager
 * @param {Store<any>} store
 * @returns {S}
 */
export function reduxHandlerFactory<S extends object>(manager: S, store: Store<any>): S {


    //找到父类redux action的构造函数
    const superConstructor = manager['__proto__']['__proto__'].constructor;
    //创建 action
    const action = new superConstructor();
    const actionFactory = reduxActionFactory(action, store);

    return reduxManagerFactory(manager, actionFactory, store) as S;
}



