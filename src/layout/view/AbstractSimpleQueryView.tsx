import AbstractSimpleView, {ViewProps, ViewState} from "./AbstractSimpleView";
import {ApiQueryReq} from "typescript_api_sdk/src/api/model/ApiQueryReq";
import {SimpleQueryHelper} from "../../helper/query/SimpleQueryHelper";

export interface SimpleQueryViewState extends ViewState {

}

export  type QueryCallBack<E=any> = (p: Promise<E>) => Promise<E>

/**
 * 简单的查询视图
 *
 * 仅支持 单个对象的查询
 * @param Q 查询长参数
 */
export default abstract class AbstractSimpleQueryView<Q extends ApiQueryReq,
    E,
    T extends ViewProps,
    S extends SimpleQueryViewState>
    extends AbstractSimpleView<T, S> {

    protected queryHelper: SimpleQueryHelper<Q>;

    /**
     * 是否分页
     */
    protected isPaging: boolean;


    constructor(props: T, context: any, isPaging = true) {
        super(props, context);
        this.queryHelper = new SimpleQueryHelper<Q>(isPaging);
        this.isPaging = isPaging;
    }

    /**
     * 已串行的方式查询
     * @param {boolean} rest 是否重置查询条件，默认 false
     */
    protected serialQuery = (rest: boolean = false): Promise<any> => {
        if (rest) {
            this.queryHelper.restQuery();
        }
        return this.queryHelper.lockStatusQuery(this.executeQuery, rest);
    };

    /**
     * @param {Q} req
     * @param {boolean} isRest 是否需要重置
     * @param {QueryCallBack} callback
     */
    protected abstract executeQuery: (req: Q, isRest: boolean, callback: QueryCallBack<E>) => Promise<any>


}

