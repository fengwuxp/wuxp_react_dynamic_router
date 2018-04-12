import {NativeRouteOption, RouteMeta, RouteOption} from "./NativeRouteOption";
import {buildResourceByURI} from "../../../utils/RaxBuildResourcePathUtil";
import {isNullOrUndefined} from "util";
import NativeRouteStrategy from "./NativeRouteStrategy";
import {URLArgumentsResolve} from "./URLArgumentsResolve";


/**
 * 路由配置
 * @type {{default: NativeRouteStrategy}}
 */
const routeOption: NativeRouteOption = require("");


/**
 * 默认路由元数据
 * @type {{main: boolean; requireAuth: boolean}}
 */
const DEFAULT_ROUTE_META: RouteMeta = {main: false, requireAuth: false};

/**
 * 原生路由处理者
 */
export default class NativeRouteHandler {


    /**
     * 关闭当前页面
     */
    pop = (): void => close();

    /**
     * 路由跳转
     * @param {NativeLocationDescriptorObject} location
     */
    push = (location: NativeLocationDescriptorObject): void => {

        const {path, params, animationType} = location;

        const option: RouteOption = routeOption[path];
        if (isNullOrUndefined(option)) {
            return null;
        }

        let {url, meta} = option;

        if (isNullOrUndefined(meta)) {
            meta = DEFAULT_ROUTE_META
        }
        const {main, requireAuth} = meta;

        if (requireAuth) {
            //需要登录，登录检查
        }

        const jsURL: string = NativeRouteStrategy.generateNativeJSPath(url, main) + "?" + URLArgumentsResolve.argumentsToString(params, true);

        open(jsURL);

    }
}

/**
 * 原生LocationDescriptorObject
 */
export interface NativeLocationDescriptorObject {

    //路径
    path: string,

    //参数
    params?: object,

    //跳转动画
    animationType?: string
}



