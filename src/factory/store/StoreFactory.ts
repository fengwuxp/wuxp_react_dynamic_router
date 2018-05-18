import {applyMiddleware, combineReducers, createStore, Reducer, ReducersMapObject, Store} from 'redux'
import createSagaMiddleware, {SagaMiddleware, SagaMiddlewareOptions} from 'redux-saga'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import BrowserNavigatorFactory from "../navigator/web/BrowserNavigatorFactory";

const history = BrowserNavigatorFactory.factory();
const routeMiddleware = routerMiddleware(history);

/**
 * redux store 构建器
 */
class StoreBuilder<S> {


    /**
     * 最终生成 state 的Reducer
     */
    private reducers: Reducer<S>;

    /**
     * sage中间件
     */
    private _sagaMiddleware: SagaMiddleware<any>;


    constructor(reducers: Reducer<S>, sagaMiddleware: SagaMiddleware<any>) {
        this.reducers = reducers;
        this._sagaMiddleware = sagaMiddleware;
    }


    build = (): Store<S> => {
        const {reducers, sagaMiddleware} = this;

        return createStore<S,any,any,any>(
            reducers,
            applyMiddleware(routeMiddleware,sagaMiddleware)
        );
    };

    get sagaMiddleware(): SagaMiddleware<any> {
        return this._sagaMiddleware;
    }
}

/**
 * 获取一个store 的建造者
 * @param {ReducersMapObject} reducers
 * @param {SagaMiddlewareOptions<any>} options
 * @returns {StoreBuilder<S>}
 */
export function reduxStoreBuilderFactory<S>(reducers: ReducersMapObject, options?: SagaMiddlewareOptions<any>) {

    const _reducers = combineReducers({
        ...reducers,
        router: routerReducer
    });

    const sagaMiddleware = createSagaMiddleware(options);

    return new StoreBuilder<S>(_reducers as any, sagaMiddleware);
}
