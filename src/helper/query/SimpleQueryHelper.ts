import {ApiQueryReq} from "typescript_api_sdk/src/api/model/ApiQueryReq";
import {QueryCallBack} from "../../layout/view/AbstractSimpleQueryView";
import {PageInfo} from "typescript_api_sdk/src/api/model/PageInfo";
import {isArray} from "util";

interface QueryStatus {
    loading: boolean;
    end
}

//默认查询条件
const DEFAULT_QUERY_CONDITION: ApiQueryReq = {
    querySize: 10,
    queryPage: 1
};

export class SimpleQueryHelper<Q extends ApiQueryReq=any> {

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
    protected isPaging: boolean;

    // protected queryQueue: Promise<any>[];


    constructor(isPaging: boolean) {
        // this._req = {} as Q;
        this.isPaging = isPaging;
    }


    get req(): Q {
        return this._req;
    }

    /**
     * 初始化
     * @param {Q} req页
     */
    initQuery = (req: Q) => {
        this._req = Object.assign({}, this.isPaging ? DEFAULT_QUERY_CONDITION : {}, req);
        this.restQuery();
    };

    /**
     * 锁定查询状态
     */
    public lockStatusQuery = (query: (req: Q, isRest: boolean, callback: QueryCallBack) => Promise<any>, rest: boolean): Promise<any> => {
        if (this.isLoading()) {
            return;
        }
        this.queryStatus.loading = true;

        return query(this._req, rest, (p: Promise<any>) => {
            return p.then((data) => {
                console.log("-------------data-----------", data)
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
        if (this.isPaging) {
            this._req.queryPage = 1;
        }
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

    protected queryIsEnd = (data: Array<any> | PageInfo<any>) => {
        let len;
        if (isArray(data)) {
            len = data.length;
        } else {
            len = data.records.length;
        }
        this.queryStatus.end = len < this._req.querySize;
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
