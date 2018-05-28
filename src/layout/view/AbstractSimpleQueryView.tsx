import AbstractSimpleView, {ViewProps, ViewState} from "./AbstractSimpleView";
import {ApiQueryReq} from "typescript_api_sdk/src/api/model/ApiQueryReq";

export interface SimpleQueryViewState extends ViewState {

}

/**
 * 查询视图
 *
 * 仅支持 单个对象的查询
 * @param Q 查询长参数
 */
export default abstract class AbstractSimpleQueryView<Q extends ApiQueryReq,
    T extends ViewProps,
    S extends SimpleQueryViewState>
    extends AbstractSimpleView<T, S> {

    protected queryHelper: SimpleQueryHelper<Q>;


    constructor(props: T, context: any) {
        super(props, context);
        this.queryHelper = new SimpleQueryHelper<Q>();
    }

    /**
     * 已串行的方式查询
     * @param {boolean} rest 是否重置查询条件，默认 false
     */
    protected serialQuery = (rest: boolean = false) => {
        if (rest) {
            this.queryHelper.restQuery();
        }
        this.queryHelper.lockStatusQuery(this.executeQuery);
    };

    protected abstract executeQuery: (req: Q) => Promise<any>;


}

interface QueryStatus {
    loading: boolean;
    end
}

//默认查询条件
const DEFAULT_QUERY_CONDITION: ApiQueryReq = {
    querySize: 10,
    queryPage: 1
};

class SimpleQueryHelper<Q extends ApiQueryReq=any> {

    /**
     * 查询状态
     * @type {{loading: boolean; end: boolean}}
     */
    protected queryStatus: QueryStatus;

    protected _req: Q;

    /**
     * 查询是否分页
     * @type {boolean}
     */
    protected isPaging: boolean = true;

    // protected queryQueue: Promise<any>[];


    constructor() {
        this._req = {} as Q;
        this.restQuery();
    }


    get req(): Q {
        return this._req;
    }

    /**
     * 初始化
     * @param {Q} req
     * @param {boolean} isPaging 是否分页
     */
    initQuery = (req: Q, isPaging: boolean = true) => {
        this._req = Object.assign(this._req, isPaging ? DEFAULT_QUERY_CONDITION : {}, req);
        this.isPaging = isPaging;
    };

    /**
     * 锁定查询状态
     */
    public lockStatusQuery = (query: (req: Q) => Promise<any>) => {
        if (this.isLoading()) {
            return;
        }
        this.queryStatus.loading = true;

        query(this._req).then((data) => {
            this.unLockQueryStatus();
            if (this.isPaging) {
                //查询是否结束
                this.queryIsEnd(data);
                this.nextPage();
            } else {
                this.queryStatus.end = true;
            }
            return data;
        }).catch((e) => {
            this.unLockQueryStatus();
            return e;
        });
    };


    /**
     * 是否处于查询状态中
     * @return {boolean}
     */
    public isLoading = (): boolean => {
        return this.queryStatus.loading || this.queryStatus.end;
    };

    /**
     * 查询是否结束
     * @return {boolean}
     */
    public isEnd = (): boolean => {
        return this.queryStatus.end;
    };

    /**
     * 重置查询
     */
    public restQuery = () => {
        this._req.queryPage = 1;
        this.queryStatus = {
            loading: false,
            end: false
        };
    };

    /**
     * 下一页
     */
    protected nextPage = () => {
        this._req.queryPage++;
    };

    protected queryIsEnd = (data: Array<any>) => {
        this.queryStatus.end = data.length > this._req.querySize;
    };


    /**
     * 解除查询状态
     */
    protected unLockQueryStatus = () => {


        this.queryStatus.loading = false;

    };

    // protected serialQuery = () => {
    //
    // };
    //
    // protected abstract executeQuery: () => Promise<any>;
}
