import {ReduxRouterProps} from "./redux/ReduxRouterProps";
import * as React from "react";

/**
 * base props
 */
export interface ReactBaseProps extends ReduxRouterProps {

    style?: React.CSSProperties;

    className?: string;
}
