import {Action} from "redux";

/**
 * redux action
 */
export interface ReduxAction<T=any> extends Action<T> {

    /**
     * 数据负载 用来传递state 数据
     */
    payload: T;

}
