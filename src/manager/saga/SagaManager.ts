import {fork, takeEvery} from "redux-saga/effects";
import {isFunction, isNullOrUndefined} from "util";


/**
 * saga effects对象的缓存
 * @type {{}}
 */
const SAGA_CACHE = {};

/**
 * saga task 默认匹配方式 通配符，匹配所有事件
 * @type {string}
 */
const SAGA_ROOT_DEFAULT_PATTER: string = "*";


/**
 * 添加一个普通的saga处理者
 * @param {any} actionHandler redux action hander
 * @param {any} sagaHandler redux sagaHandler
 */
export function addSagaHandler(actionHandler: any, sagaHandler: any) {

    // const handler = new actionHandler();
    SAGA_CACHE[sagaHandler.name] = new actionHandler();

}

/**
 * 添加一个错误处理者
 * @param {any} actionHandler redux action hander
 * @param {any} sagaHandler redux sagaHandler
 */
export function addSagaErrorHandler(actionHandler: any, sagaHandler: any) {
    addSagaHandler(actionHandler, sagaHandler);
}


/**
 * 查找一个 saga处理函数
 * @param {string} type
 * @returns {any}
 */
function finSagaFunctionByActionType(type: string) {

    const types = type.split(".");
    // console.log(SAGA_CACHE);
    let handler = SAGA_CACHE[types[0]];
    if (isNullOrUndefined(handler)) {
        return;
    }
    return SAGA_CACHE[types[0]][types[1]];
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
        yield takeEvery(SAGA_ROOT_DEFAULT_PATTER, function* (action) {

            // console.log("接收到一个action");
            // console.log(action);
            //从注册中查找要执行的任务
            let sagaAction = finSagaFunctionByActionType(action.type);
            if (isFunction(sagaAction)) {
                //以非阻塞的形式调用
                console.log(`执行saga 任务-> ${action.type}`);
                yield fork(sagaAction, (action as any).payload);
            }
        });
    }
}



