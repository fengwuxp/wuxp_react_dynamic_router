import {ReduxRouterProps} from "../redux/ReduxRouterProps";
import {WrappedFormUtils} from "antd/lib/form/Form";




/**
 * ant from
 */
export interface AntdFromBaseProps extends ReduxRouterProps {

    /**
     * antd 通过 from.create创建的组件会注入该props
     */
    form: WrappedFormUtils;
}
