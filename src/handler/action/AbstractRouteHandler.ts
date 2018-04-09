import {ActionHandler} from "./ActionHandler";
import {ActionConfig, PromptData} from "../../model/ActionConfig";
import {isNullOrUndefined, isUndefined} from "util";
import {PromptType} from "../../enums/PromptType";
import {stringify} from "querystring";

/**
 * 抽象的路由处理者
 */
export default abstract class AbstractRouteHandler implements ActionHandler {


    abstract handle: (...params) => void;

    /**
     * 提示
     */
    protected abstract toast: (...params) => void;

    /**
     * 通知
     */
    protected abstract notice: (...params) => void;

    /**
     * 警告
     */
    protected abstract alter: (...params) => void;

    /**
     * 确认
     */
    protected abstract confirm: (...params) => void;


    /**
     * 跳转
     */
    protected abstract jump: (...params) => void;


    protected route = (action: ActionConfig, data: any): void => {

        const {value, params, promptData, desc} = action;

        if (isNullOrUndefined(promptData)) {
            this.jump(value, params);
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
