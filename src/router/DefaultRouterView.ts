import * as React from "react";
import {RouterView, RouterViewProps} from "./RouterView";
import {Action, Location} from "history";
import {parse, stringify} from "querystring";
import ApiClientFetch from "typescript_api_sdk/src/api/impl/es/ApiClientFetch";
import {DataType} from "typescript_api_sdk/src/api/enums/DataType";
import ApiRequestResolver from "../resolve/ApiRequestResolver";
import {ActionResolver} from "../resolve/ActionResolver";

const apiClientFetch = new ApiClientFetch(false);

/**
 * 默认路由视图
 */
export abstract class DefaultRouterView<P extends RouterViewProps, S> extends React.Component<P, S> implements RouterView<P> {


    protected requestResolver: ActionResolver;


    constructor(props, context) {
        super(props, context);
        this.requestResolver = new ApiRequestResolver(this.props);
    }

    back = (event: React.MouseEvent<HTMLElement>) => {
        this.props.history.goBack();
    };


    toView = (path: string, params: any = {}, useServerControl: boolean = true): void => {

        if (useServerControl) {
            //加载数据 数据加载完成后使用 state传递数据
            const promise = this.requestResolver.resolve(path, params);
        } else {
            this.props.history.push({
                pathname: path,
                search: stringify(params)
            })
        }

        // apiClientFetch.post({
        //     url: "/react" + path,
        //     data: params,
        //     dataType: DataType.JSON
        // }).then((data) => {
        //     console.log(data);
        //     this.props.history.push({
        //         pathname: path,
        //         state: data,
        //         search: stringify(params)
        //     });
        // }).catch((e) => {
        //     console.log(e);
        //     this.props.history.push({
        //         pathname: "/error",
        //         state: {},
        //         search: stringify(params)
        //     });
        // });

    };


    routerListen = (p?: any) => {
        this.props.history.listen((location: Location, action: Action) => {
            //解析url参数
            // const queryParams = queryString.parse(location.search);
            let str = location.search.split("?")[1] || '';
            const queryParams = parse(str);
            // console.log(queryParams);
            // console.log(location.state);
        });
    };


    /**
     * 通过广播改变路由
     */
    changeRouterByBroadcast = () => {

    }

}
