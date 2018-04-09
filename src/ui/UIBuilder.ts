import * as React from "react";

/**
 * ui 构建
 */
export interface UIBuilder {


    /**
     * 加入一个组件到视图中
     * @param arguments
     * @returns {React.ReactNode}
     */
    appendComponent: (...arguments) => React.ReactNode;
}
