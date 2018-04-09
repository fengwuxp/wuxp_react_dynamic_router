import * as React from "react";
import * as Loadable from 'react-loadable';
import Loading from "./Loading";


export default function asyncComponent<T>(component: any): React.ComponentType<T> {


    const C: React.ComponentType<T> = Loadable({
        loader: () => component(),
        loading: () => <Loading/>
    });


    class AsyncComponent extends React.Component<T, any> {
        render() {
            return C ? <C {...this.props}/> : null
        }
    }

    return AsyncComponent;
}
