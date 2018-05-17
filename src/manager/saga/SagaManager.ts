import {call, fork, put, takeEvery} from "redux-saga/effects";
import {isFunction, isNullOrUndefined} from "util";
import {ReduxAction} from "../../proxy/redux/ReduxReducer";
import {getReducerTypeNameBySaga, SAGA_ACTION_TYPE_SUFFIX} from "../../proxy/redux/ProxyReduxAction";


/**
 * saga effects对象的缓存
 * @type {{}}
 */
const SAGA_CACHE: Map<string, any> = new Map<string, any>();


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
 * @param handler
 */
export function addSagaHandler(handler: any) {

    // const handler = new actionHandler();
    SAGA_CACHE.set(handler.constructor.name, handler);

}

/**
 *  添加一个错误处理者
 * @param handler
 */
export function addSagaErrorHandler(handler: any) {
    addSagaHandler(handler);
}


/**
 * 查找一个 saga处理函数
 * @param {string} type
 * @returns {any}
 */
function finSagaFunctionByActionType(type: string) {

    const types = type.split(".");
    // console.log(SAGA_CACHE);
    let handler = SAGA_CACHE.get(types[0]);
    if (isNullOrUndefined(handler)) {
        return;
    }
    return handler[types[1]];
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
            let sagaAction = finSagaFunctionByActionType(reducerTypeName);
            if (isFunction(sagaAction)) {
                //以非阻塞的形式调用
                console.log(`执行saga 任务-> ${type}`);
                const result = yield call(sagaAction, payload, reducerTypeName);

                console.log(`更新 saga 任务-> 结果到store  type=${reducerTypeName}`, result);
                //更新state
                yield put({
                    type: reducerTypeName,
                    payload: result
                });

            } else {
                console.log("接收到未知的saga任务", type)
            }
        });
    }
}



