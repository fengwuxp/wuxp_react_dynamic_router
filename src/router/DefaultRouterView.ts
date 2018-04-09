import * as React from "react";
import {RouterView, RouterViewProps} from "./RouterView";
import {Action, History, Location} from "history";
import {parse, stringify} from "querystring";
import ApiRequestResolver from "../resolve/ApiRequestResolver";
import {ActionResolver} from "../resolve/ActionResolver";
import browserNavigatorFactory from "../factory/navigator/BrowseRNavigatorFactory";

let browserNavigator = null;

/**
 * 默认路由视图
 */
export abstract class DefaultRouterView<P extends RouterViewProps, S> extends React.Component<P, S> implements RouterView<P> {


    //请求解析器
    protected requestResolver: ActionResolver;


    constructor(props, context) {
        super(props, context);
        //浏览器导航器
        if (browserNavigator === null) {
            browserNavigator = browserNavigatorFactory.get();
        }
        this.requestResolver = new ApiRequestResolver();
    }

    back = (event: React.MouseEvent<HTMLElement>) => {
        browserNavigator.goBack();
    };


    toView = (path: string, params: any = {}, useServerControl: boolean = true): void => {

        if (useServerControl) {
            //加载数据 数据加载完成后使用 state传递数据
            this.requestResolver.resolve(path, params);
        } else {
            browserNavigator.push({
                pathname: path,
                search: stringify(params)
            });
        }
    };


}
