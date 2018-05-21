import {Layout} from "../Layout";
import {UIBuilder} from "../../ui/UIBuilder";
import * as React from "react";


/**
 * 简单的通用view
 * 基于flex布局将页面简单的分为
 * <View>
 *     <Header></Header>
 *     <Body></Body>
 *     <Fotter></Fotter>
 * </View>
 */
export interface SimpleView extends Layout {

    renderHeader: () => React.ReactNode;

    renderBody: () => React.ReactNode;

    renderFooter: () => React.ReactNode;
}
