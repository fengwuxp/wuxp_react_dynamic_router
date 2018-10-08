import {SimpleView} from "./SimpleView";
import React, {ErrorInfo} from "react";
import FlexView from "../../components/view/FlexView";
import "./view.less";
import {ReduxRouterProps} from "../../model/redux/ReduxRouterProps";
import {routerHandler} from "../../redux/ProxyReduxAction";
import TimerTaskManager from "typescript_api_sdk/src/task/timer/TimerTaskManager";
import {TimerHandler} from "typescript_api_sdk/src/task/timer/Timer";
import TimerTask from "typescript_api_sdk/src/task/timer/TimerTask";
import ApiRequestTaskManager from "typescript_api_sdk/src/task/api/ApiRequestTaskManager";
import {TaskManager} from "typescript_api_sdk/src/task/TaskManager";
import {FormComponentProps} from "../../../types/FormComponentProps";

//设置定时执行器
TimerTask.setTimer(window as any);

export interface ViewProps extends ReduxRouterProps {

    [key: string]: any;
}

export interface ViewFormProps extends ViewProps, FormComponentProps {

    [key: string]: any;
}

export interface ViewState {

    [key: string]: any

    /**
     * FlexView  style
     */
    containerStyle?: React.CSSProperties;
}

export interface ViewParams {

    [key: string]: any;
}


export interface ViewRenderHelper {

    /**
     *  render helper
     * @param p
     * @return {React.ReactNode}
     */
    renderHeader: (...p) => React.ReactNode;
}


const viewBuilderStyle: React.CSSProperties = {
    position: "relative",
    height: "100%"
};


/**
 * 基础的flex视图
 */
export default abstract class AbstractSimpleView<P extends ViewProps, S extends ViewState> extends React.Component<P, S>
    implements SimpleView {

    /**
     * render helper
     */
    protected renderHelper: ViewRenderHelper;


    /**
     * 定时任务管理者
     * @type {TaskManager}
     */
    protected timerTaskManager: TaskManager = new TimerTaskManager();

    /**
     * api请求任务管理者
     * @type {ApiRequestTaskManager}
     */
    // protected apiTaskManager: ApiRequestTaskManager = new ApiRequestTaskManager();


    constructor(props: P, context: any) {
        super(props, context);
    }


    renderBody = (): React.ReactNode => null;

    renderFooter = (): React.ReactNode => null;

    renderHeader = (): React.ReactNode => null;


    render() {

        return this.renderContent();
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {

        //统一异常捕获

        console.error("-------error-----", error);
        console.error("-------errorInfo-----", errorInfo)
    }

    /**
     * 组件被销毁钱调用
     */
    componentWillUnmount() {

        //销毁所有的定时器
        this.timerTaskManager.taskQueue.forEach((task) => {
            console.log("废弃一个定时任务");
            task.throwAway()
        });

    }

    /**
     * 返回
     * @type {() => any}
     */
    goBack = routerHandler.goBack;

    /**
     * 跳转到某个视图
     * @type {(location: (ViewLocationDescriptorObject | string), state?: LocationState) => any}
     */
    to = routerHandler.push;


    /**
     * 创建一个执行一次的定时任务
     * @param {TimerHandler} handler
     * @param {number} timeout
     */
    protected newOnceTask = (handler: TimerHandler, timeout: number) => {
        this.timerTaskManager.push(TimerTask.newOnceTask(handler, timeout));
    };

    /**
     * 创建一个循环执行的定时任务
     * @param {TimerHandler} handler
     * @param {number} timeout
     */
    protected newLoopTask = (handler: TimerHandler, timeout: number) => {
        this.timerTaskManager.push(TimerTask.newLoopTask(handler, timeout));
    };

    /**
     * 渲染一个包装层，可以吧body包装起来
     * @param {React.ReactNode} children
     * @return {React.ReactNode}
     */
    protected renderWrapper = (children: React.ReactNode) => children;


    /**
     * 渲染页面内容
     * @return {React.ReactNode}
     */
    private renderContent = () => <FlexView key={`${AbstractSimpleView.name}_flex_view`}
                                            className={"d_flex app_root flex_column"}
                                            style={{...viewBuilderStyle, ...(this.state.containerStyle as object)}}
                                            header={this.renderHeader()}
                                            footer={this.renderFooter()}>{this.renderWrapper(this.renderBody())}</FlexView>

}
