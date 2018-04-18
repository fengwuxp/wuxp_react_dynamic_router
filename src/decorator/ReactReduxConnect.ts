import {connect, MapStateToPropsParam, MapDispatchToPropsFunction} from "react-redux";


export function ReactReduxConnect(mapStateToPropsParam: MapStateToPropsParam<any, any, any>,
                                  mapDispatchToProps?: MapDispatchToPropsFunction<any, any>): Function {
    return function (c) {
        return connect(mapStateToPropsParam, mapDispatchToProps)(c);
    }
}

