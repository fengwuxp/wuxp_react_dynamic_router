import {SimpleView} from "./SimpleView";
import React from "react";
import FlexView from "../../components/view/FliexView";
import {isNullOrUndefined} from "util";


export interface ViewBuildState {


    buildComponents: React.ReactNode | React.ReactNode[];
}

const viewBuilderStyle: React.CSSProperties = {
    position: "relative",
    flex: 1
};


export default abstract class AbstractSimpleView<P, S extends ViewBuildState> extends React.Component<P, S> implements SimpleView {


    constructor(props: P, context: any) {
        super(props, context);

        this.state = {} as S;
    }

    appendMaskComponent = (component: React.ReactNode): this => {
        // let {components} = this.state;
        // components = component;

        //直接替换
        this.setState({
            buildComponents: component
        });

        return this;
    };

    removeMaskComponent = () => {
        //直接清空
        this.setState({
            buildComponents: null
        });
    };


    abstract renderBody: () => React.ReactNode;

    abstract renderFooter: () => React.ReactNode;

    abstract renderHeader: () => React.ReactNode;


    render() {


        return <div key={"flex_view"}
                    style={viewBuilderStyle}>
            <FlexView key={"flex_view"}
                      style={viewBuilderStyle}
                      header={this.renderHeader()}
                      footer={this.renderFooter()}>
                {this.renderBody()}
            </FlexView>
            {this.maskView()}
        </div>
    }

    protected maskView = () => {

        const {buildComponents} = this.state;

        if (isNullOrUndefined(buildComponents)) {
            return null;
        }

        return <div key="mask_view" style={{...this.getMaskStyle(), position: "absolute"}}>{buildComponents}</div>;
    };


    protected getMaskStyle = (): React.CSSProperties => {

        return {};
    }
}
