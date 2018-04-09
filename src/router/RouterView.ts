

export interface RouterViewProps {

    history: any
}

/**
 * 路由视图
 */
export interface RouterView<RouterViewProps> {

    /**
     * 返回
     * @param p
     */
    back: (p?: any) => void

    /**
     * 跳转
     * @param path   跳转路径
     * @param params 参数
     * @param useServerControl   是否使用服务端控制
     */
    toView: (path: string, params?: any, useServerControl?: boolean) => void

}
