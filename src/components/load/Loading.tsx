import * as React from "react";
import LoadingComponentProps = LoadableExport.LoadingComponentProps;

/**
 * 加载中
 */
export default class Loading extends React.Component<LoadingComponentProps, any> {
    render() {
        return <div>Loading...</div>
    }
}

