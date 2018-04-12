export interface NativeRouteOption {
    [k: string]: RouteOption
}

export interface RouteOption {

    url: string

    meta?: RouteMeta,
}

/**
 * 路由元数据
 */
export interface RouteMeta {

    /**
     * 是否需要登录
     * 默认 false
     */
    requireAuth?: boolean;

    /**
     * 是否为主页
     * 默认 false
     */
    main?: boolean
}
