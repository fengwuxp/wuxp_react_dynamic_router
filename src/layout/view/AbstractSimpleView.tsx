import {SimpleView} from "./SimpleView";
import React from "react";
import FlexView from "../../components/view/FlexView";
import {isNullOrUndefined} from "util";


export interface ViewProps {

    [key: string]: any
}

export interface ViewState {

    [key: string]: any
}


const viewBuilderStyle: React.CSSProperties = {
    position: "relative",
    flex: 1
};


export default abstract class AbstractSimpleView<P extends ViewProps, S extends ViewState> extends React.Component<P, S> implements SimpleView {


    constructor(props: P, context: any) {
        super(props, context);
    }


    abstract renderBody: () => React.ReactNode;

    abstract renderFooter: () => React.ReactNode;

    abstract renderHeader: () => React.ReactNode;


    render() {

        return <FlexView key={`${AbstractSimpleView.name}_flex_view`}
                         style={viewBuilderStyle}
                         header={this.renderHeader()}
                         footer={this.renderFooter()}>
            {this.renderBody()}
        </FlexView>
    }

    protected back = () => {
        window.history.back();
    }


}
