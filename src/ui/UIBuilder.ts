import * as React from "react";

/**
 * ui 构建
 */
export interface UIBuilder {


    /**
     * 加入一个组件到视图中
     * @param params
     * @returns {React.ReactNode}
     */
    appendComponent: (...params) => React.ReactNode;
}
