import {SimpleView} from "../layout/view/SimpleView";
import {registerRouteByEnd} from "./LocalRouteConfig";
import asyncComponent from "../components/load/AsyncComponent";


export interface LocalRouteOptions {

    /**
     * 路径
     */
    path: string;

    /**
     * 上级路由
     */
    parentPath?: string;

    /**
     * 路由名称
     */
    name?: string;

    /**
     * 异步
     * 默认：true
     */
    async?: boolean;

    /**
     * 排序
     * 排序从0开始，数值越大，越靠后
     * 默认：-1 排到后
     */
    order?: number;
}

const DEFAULT_OPTIONS: LocalRouteOptions = {
    async: true,
    order: -1
} as LocalRouteOptions;

/**
 * 本地路由
 * 用于路由声明，避免过于复杂的配置
 */
export function LocalRoute(options: LocalRouteOptions) {

    const newOptions = {...DEFAULT_OPTIONS, ...options};

    return function (target: SimpleView, name: string, descriptor: PropertyDescriptor): SimpleView {


        if (newOptions.parentPath) {
            //查找上级路由
        }


        if (newOptions.order === -1) {
            registerRouteByEnd({
                name: newOptions.name,
                path: newOptions.path,
                component: asyncComponent(target)
            });
        }


        return target;

    }
}
