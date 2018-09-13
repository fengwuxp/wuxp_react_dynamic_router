import * as React from "react";
import WheelIndicator, {WheelIndicatorHandler} from "../../event/wheel/WheelIndicator";
import *  as ReactDOM from "react-dom";


export interface MouseWheelIndicatorProps {
    /**
     * 阻止默认行为
     */
    preventMouse?: boolean;

    /**
     * 处理者
     */
    handle: WheelIndicatorHandler;
}

/**
 *  鼠标滑轮滚动指示器
 * @author wxup
 * @create 2018-09-13 20:51
 **/
export default class MouseWheelIndicator extends React.Component<MouseWheelIndicatorProps, any> {

    private indicator: WheelIndicator;

    private el;

    constructor(props: MouseWheelIndicatorProps, context: any) {
        super(props, context);

    }

    componentDidMount() {
        const {preventMouse, handle} = this.props;
        //初始化指示器
        this.indicator = new WheelIndicator({
            element: ReactDOM.findDOMNode(this.el) as HTMLElement,
            preventMouse,
            handle
        });
    }

    render() {
        const {children} = this.props;
        return <div ref={el => this.el = el}>{children}</div>;
    }

    componentWillUnmount() {
        this.indicator.destroy();
    }
}
