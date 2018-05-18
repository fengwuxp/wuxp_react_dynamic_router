import {ReduxAction} from "./ReduxAction";

/**
 * saga handler
 */
export interface SagaHandler<T=any> {

    /**
     * 默认情况的数据
     */
    default: T,

    // [key: string]: (...p) => ReduxAction<T>;
}
