import {isFunction, isNullOrUndefined, isUndefined} from "util";
import { AnyAction, Reducer} from "redux";

/**
 * redux reducer定义
 */
export interface ReduxReducer<S> {

    /**
     * 默认的state
     */
    default?: any;

    /**
     * reducers
     */
    [key: string]: Reducer<S> | any;

}

/**
 * redux action
 */
export interface ReduxAction extends AnyAction {

    /**
     * 数据负载 用来传递state 数据
     */
    payload: any;

}


/**
 * reducer 工厂
 * @param {T} reducer
 * @returns {Reducer<S>}
 */
export function reducerFactory<T extends ReduxReducer<S>, S>(reducer: T): Reducer<S> {


    /**
     * 返回一个reducer 方法
     * @param {S}sate
     * @param {any} action
     */
    return function (state: S, action: ReduxAction): S {

        // console.log(state);
        // console.log(action);

        const {type, payload} = action;

        let element: any;

        if (type in reducer) {
            //是 reducer中要的type
            element = reducer[type];
            if (isUndefined(element)) {
                //如果是undefined，使用action中的 payload
                // console.log(`-->payload ${payload}`);
                element = payload;
                // console.log(element);
            } else if (isFunction(element)) {
                //函数
                element = element(state, action) as S;
            }
        } else {
            //也许是来自redux 初始化的type或者 saga中的 type
            if (isNullOrUndefined(element) && isNullOrUndefined(state)) {
                //第一次(即初始化)使用默认值
                let _default: any = reducer.default;
                if (isFunction(_default)) {
                    _default = _default();
                }
                // console.log(`_default=${_default}`)
                return _default;
            }
        }


        return isUndefined(element) ? state : element as S;
    }
}
