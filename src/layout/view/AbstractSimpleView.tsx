import {SimpleView} from "./SimpleView";
import React, {ErrorInfo} from "react";
import FlexView from "../../components/view/FlexView";
import {Layout} from "../Layout";


export interface ViewProps {

    [key: string]: any
}

export interface ViewState {

    [key: string]: any

    containerStyle?: React.CSSProperties;
}


const viewBuilderStyle: React.CSSProperties = {
    position: "relative",
    flex: 1
};

/**
 * 基础的flex视图
 */
export default abstract class AbstractSimpleView<P extends ViewProps, S extends ViewState> extends React.Component<P, S>
    implements SimpleView, Layout {


    constructor(props: P, context: any) {
        super(props, context);
    }


    renderBody = (): React.ReactNode => null;

    renderFooter = (): React.ReactNode => null;

    renderHeader = (): React.ReactNode => null;


    render() {
        return <FlexView key={`${AbstractSimpleView.name}_flex_view`}
                         style={Object.assign({}, viewBuilderStyle, this.state ? this.state.containerStyle : {})}
                         header={this.renderHeader()}
                         footer={this.renderFooter()}>
            {this.renderBody()}
        </FlexView>
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("-------error-----", error);
        console.error("-------errorInfo-----", errorInfo);
    }


    protected goBack = () => {
        window.history.back();
    }


}
