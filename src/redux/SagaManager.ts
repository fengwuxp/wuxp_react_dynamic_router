import {call, put, takeEvery} from "redux-saga/effects";
import {isFunction, isNullOrUndefined, isUndefined} from "util";
import {getReducerTypeNameBySaga, SAGA_ACTION_TYPE_SUFFIX} from "./ProxyReduxAction";
import {ReduxAction} from "./ReduxAction";
import {SagaHandler} from "./SagaHandler";


/**
 * saga effects对象的缓存
 * @type {{}}
 */
const SAGA_CACHE: Map<string, SagaHandler> = new Map<string, SagaHandler>();


/**
 * 匹配我们自身需要处理的 saga 通知
 * @param {ReduxAction} action
 * @return {boolean}
 * @constructor
 */
const SAGA_ROOT_DEFAULT_PATTER = function (action: ReduxAction) {

    return action.type.endsWith(SAGA_ACTION_TYPE_SUFFIX);
};


/**
 *
 * 添加一个普通的saga处理者
 * @param {SagaHandler} handler
 */
export function addSagaHandler(handler: SagaHandler) {

    // const handler = new actionHandler();


    SAGA_CACHE.set(handler.constructor.name, handler);

}

/**
 *  添加一个错误处理者
 * @param {SagaHandler} handler
 */
export function addSagaErrorHandler(handler: SagaHandler) {
    addSagaHandler(handler);
}


/**
 * 查找一个 saga处理函数
 * @param {string} type
 * @returns {any}
 */
function finSagaFunctionByActionType(type: string) {

    const types = type.replace(SAGA_ACTION_TYPE_SUFFIX, "").split(".");
    let handler = SAGA_CACHE.get(types[0]);
    if (isNullOrUndefined(handler)) {
        return {};
    }

    const actionName = handler.actionNames.get(types[1]);

    return {
        handler: handler[types[1]],
        actionName: `${types[0]}.${actionName}`
    };
}

/**
 * 返回一个root saga
 * root saga中用于分发所有事件
 * @returns {(params) => IterableIterator<ForkEffect>}
 */
export function createRootSaga() {

    /**
     * @param params
     */
    return function* (params?: any) {
        yield takeEvery(SAGA_ROOT_DEFAULT_PATTER, function* (action: ReduxAction) {


            //从注册中查找要执行的任务
            const {type, payload} = action;

            let reducerTypeName = getReducerTypeNameBySaga(type);
            console.log("接收到一个action", type, reducerTypeName);
            let {handler, actionName} = finSagaFunctionByActionType(reducerTypeName);
            if (isFunction(handler)) {
                //以非阻塞的形式调用
                console.log(`执行saga 任务-> ${type}`, handler.name);

                //将 actionName传入，便于方法内部的自身调用
                let result = yield call(handler, payload, actionName);

                //如果action 只是单纯的返回state，可以不做实现
                if (isUndefined(result)) {
                    console.log("默认策略");
                    result = payload;
                }

                console.log(`更新 saga 任务-> 结果到store  type=${actionName}`, result);
                //更新state
                yield put({
                    type: actionName,
                    payload: result
                });

            } else {
                console.log("接收到未知的saga任务", type)
            }
        });
    }
}



