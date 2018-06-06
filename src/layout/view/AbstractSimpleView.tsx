import {SimpleView} from "./SimpleView";
import React, {ErrorInfo} from "react";
import FlexView from "../../components/view/FlexView";
import BrowserNavigatorFactory from "../../factory/navigator/web/BrowserNavigatorFactory";
import "./view.less";
import {LocationDescriptorObject} from "history";
import {stringify} from "querystring";
import {ReduxRouterProps} from "../../model/redux/ReduxRouterProps";
import {FormComponentProps} from "antd/lib/form/Form";
import {isString} from "util";
import {routerHandler} from "../../redux/ProxyReduxAction";


export interface ViewProps extends ReduxRouterProps {

    [key: string]: any;
}

export interface ViewFormProps extends ViewProps, FormComponentProps {

    [key: string]: any;
}

export interface ViewState {

    [key: string]: any

    containerStyle?: React.CSSProperties;
}

export interface ViewParams {

    [key: string]: any;
}


export interface ViewRenderHelper {

    /**
     *  render helper
     * @param p
     * @return {React.ReactNode}
     */
    renderHeader: (...p) => React.ReactNode;
}


const viewBuilderStyle: React.CSSProperties = {
    position: "relative"
};

/**
 * 基础的flex视图
 */
export default abstract class AbstractSimpleView<P extends ViewProps, S extends ViewState> extends React.Component<P, S>
    implements SimpleView {

    /**
     * render helper
     */
    protected renderHelper: ViewRenderHelper;

    constructor(props: P, context: any) {
        super(props, context);
    }


    renderBody = (): React.ReactNode => null;

    renderFooter = (): React.ReactNode => null;

    renderHeader = (): React.ReactNode => null;


    render() {

        return this.renderWrapper(this.renderContent());
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("-------error-----", error);
        console.error("-------errorInfo-----", errorInfo)
    }

    protected renderWrapper = (children: React.ReactNode) => {

        // console.log("------renderWrapper--------", children);

        return children;
    };


    protected goBack = routerHandler.goBack;

    protected to = routerHandler.push;


    private renderContent = () => <FlexView key={`${AbstractSimpleView.name}_flex_view`}
                                            className={"d_flex flex_cell flex_column"}
                                            style={Object.assign({}, viewBuilderStyle, this.state ? this.state.containerStyle : {})}
                                            header={this.renderHeader()}
                                            footer={this.renderFooter()}>{this.renderBody()}</FlexView>

}
