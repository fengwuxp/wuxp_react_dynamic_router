import * as React from "react";

/**
 * ui 构建
 */
export interface UIBuilder {


    /**
     * 加入一个组件到 view的 mask 层
     * @param {React.ReactNode} component
     * @returns {this}
     */
    appendMaskComponent: (component: React.ReactNode) => this;

    /**
     * 移除
     */
    removeMaskComponent: () => void;
}
