import * as React from "react";
import {RouterView, RouterViewProps} from "./RouterView";
import {stringify} from "querystring";
import ApiRequestResolver from "../resolve/web/ApiRequestResolver";
import {ActionResolver} from "../resolve/ActionResolver";
import browserNavigatorFactory from "../factory/navigator/web/BrowseRNavigatorFactory";
import {History} from "history";

let browserNavigator:History = null;

/**
 * 浏览器路由视图
 */
export abstract class BrowseRouterView<P extends RouterViewProps, S> extends React.Component<P, S> implements RouterView<P> {


    //请求解析器
    protected requestResolver: ActionResolver;


    constructor(props: P, context: any) {
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
