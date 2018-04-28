import * as moment from "moment";
import {MomentFormatString} from "../enums/MomentFormatString";
import {isNullOrUndefined} from "util";

export default class MomentHelper {


    /**
     * 处理 moment时间
     * @param {moment.Moment} moment
     * @param {string} fmt
     * @returns {string}
     */
    static handlerMoment = (moment: any | moment.Moment, fmt?: string): any | string => {
        return moment.format(fmt);
    };

    /**
     * 处理时间范围选择器返回的 Array<moment.Moment>
     * 参考文档：http://momentjs.cn/
     * @param {Array<moment.Moment>} moments
     * @param {string} fmt
     * @returns {string[]}
     */
    static handlerRangePicker = (moments: Array<moment.Moment>, fmt?: string): string[] => {
        return moments.map((item) => {

            return item.format(fmt);
        });
    };

    /**
     * 处理表单中时间范围参数的值
     * @param req  提交的表单对象
     * @param {string} formName  表单中属性的名称
     * @param {string} fmt 格式化字符串
     * @param {string[]} prefix 范围参数的前缀
     */
    static handlerFormRangerDateParam = (req: any, formName: string, fmt?: MomentFormatString, prefix: string[] = ['min', 'max']) => {
        if (!isNullOrUndefined(req[formName])) {

            const picker = MomentHelper.handlerRangePicker(req[formName], fmt);
            req[`${prefix[0]}${formName}`] = picker[0];
            req[`${prefix[1]}${formName}`] = picker[1];
        }
        delete req[formName];
    }
}
