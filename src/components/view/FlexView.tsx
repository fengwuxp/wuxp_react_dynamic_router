import * as React from "react";


/**
 * FlexViewProps
 */
export interface FlexViewProps {

    style?: React.CSSProperties;

    className?: string;

    header?: React.ReactNode;

    footer?: React.ReactNode;
}

const flexCell: React.CSSProperties = {
    flex: 1
};

export default class FlexView extends React.Component<FlexViewProps, any> {

    constructor(props: FlexViewProps, context: any, state: any = {}) {
        super(props, context);
        this.state = state;
    }

    render(): React.ReactNode {

        // const childrenList: Array<any> = [];
        // let header: React.ReactNode = this.props.header;
        // if (!isNullOrUndefined(header)) {
        //     childrenList.push(header);
        // }
        // childrenList.push(<div style={flexCell}>{this.props.children}</div>);
        // if (!isNullOrUndefined(this.props.footer)) {
        //     childrenList.push(this.props.footer);
        // }

        return (
            <div style={this.props.style}
                 className={this.props.className}>
                {this.props.header}
                {this.props.children}
                {this.props.footer}
            </div>
        )
    }
}
