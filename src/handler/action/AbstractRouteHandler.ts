import {ActionHandler} from "./ActionHandler";
import {ActionConfig, PromptData} from "../../model/ActionConfig";
import {isUndefined} from "util";
import {PromptType} from "../../enums/PromptType";
import {stringify} from "querystring";

/**
 * 抽象的路由处理者
 */
export default abstract class AbstractRouteHandler implements ActionHandler {


    protected abstract handle: (...arguments) => void;

    /**
     * 提示
     */
    protected abstract toast: (...arguments) => void;

    /**
     * 通知
     */
    protected abstract notice: (...arguments) => void;

    /**
     * 警告
     */
    protected abstract alter: (...arguments) => void;

    /**
     * 确认
     */
    protected abstract confirm: (...arguments) => void;


    /**
     * 跳转
     */
    protected abstract jump: (...arguments) => void;


    protected route = (action: ActionConfig, data: any): void => {

        const {value, params, promptData, desc} = action;

        if (isUndefined(data)) {
            this.jump(value, params, data)
        } else {
            const {type} = promptData;
            this[type.toString().toLowerCase()](action, data);
        }


        // switch (type) {
        //     case PromptType.TOAST:
        //         //提示
        //         break;
        //     case PromptType.NOTICE:
        //         //通知
        //         break;
        //     case PromptType.ALERT:
        //         //警告
        //         break;
        //     case PromptType.CONFIRM:
        //         //确认
        //         break;
        //     default:
        //     //默认
        // }

    };

}
