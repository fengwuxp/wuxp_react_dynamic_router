/*
*  saga he action 名称查找的策略
*
*  1：前缀 或者 后缀 例如 get,set
*  2：装饰器(注解)，在saga方法上直接标注 异步操作完后需要调用的 action
*
* */


/**
 * 根据方法的名称前缀进行转换  固定支持 get set
 * @param {string} funcName
 * @param {boolean} isSet 是否为set前缀开头
 * @return {string} function name
 */
export function convertFunctionNameByPrefix(funcName: string, isSet: boolean = true) {


    return isSet ? funcName.replace("set", "get") : funcName.replace("get", "set");
}
