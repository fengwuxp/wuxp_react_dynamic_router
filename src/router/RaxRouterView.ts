import {RouterView, RouterViewProps} from "./RouterView";
import * as React from "react";


/**
 * Rax 路由视图
 */
export abstract class RaxRouterView<P extends RouterViewProps, S> extends React.Component<P, S> implements RouterView<P> {


    constructor(props: P, context: any) {
        super(props, context);
    }

    back: (p?: any) => void;


    toView: (path: string, params?: any, useServerControl?: boolean) => void;


}
