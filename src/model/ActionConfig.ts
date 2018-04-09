import {PromptType} from "../enums/PromptType";


/**
 * 提示信息
 */
export interface PromptData {

    /**
     * 动作标题
     */
    title: string

    /**
     * 提示内容
     */
    content: string

    /**
     * 提示类型
     */
    type: PromptType;

    /**
     * 按钮配置
     * key string 按钮名称,
     * value boolean 是否继续
     */
    buttons: object

}

/**
 * 动作配置
 */
export interface ActionConfig {

    /**
     * 动作类型，可能是跳转视图或者是执行某个动作
     */
    type: string;

    /**
     * 动作的值
     */
    value: string;

    /**
     * 提示数据
     */
    promptData: PromptData;

    /**
     * 动作参数
     */
    params: object;

    /**
     * 动作说明
     */
    desc: string;
}
