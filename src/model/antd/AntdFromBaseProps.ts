import {ReduxRouterProps} from "../redux/ReduxRouterProps";
import {FormComponentProps} from "../../../types/FormComponentProps";



/**
 * ant from
 * antd 通过 from.create创建的组件会注入该props
 */
export interface AntdFromBaseProps extends ReduxRouterProps, FormComponentProps {

}
