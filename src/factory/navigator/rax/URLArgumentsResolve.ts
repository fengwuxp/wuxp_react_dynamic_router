import CommonUtils from "../utils/CommonUtils";
import StringToHexUtil from "typescript_api_sdk/src/codec/StringToHexUtil";
import {parse, stringify} from "querystring";


/**
 * 默认url 参数转16进制key
 * @type {string}
 */
const DEFAULT_PARAM_KEY_NAME: string = "p_hex";


/**
 * url参数解析
 */
export class URLArgumentsResolve {


    /**
     * 参数拼接
     * @param params
     * @param {boolean} hexEncoding
     * @returns {string}
     */
    public static argumentsToString = (params: object = {}, hexEncoding: boolean): string => {


        let queryString: string = "";
        //跳过刷新参数
        if (CommonUtils.isNullOrUndefined(params['weex_refresh']) && hexEncoding) {
            //转为16进制数据
            queryString = stringify(params);
            queryString = StringToHexUtil.encode(queryString);
            console.log("转为16进制数据编码后-> " + queryString);
            queryString = DEFAULT_PARAM_KEY_NAME + "=" + queryString;
        } else {
            //TODO
        }

        return queryString;
    };


    /**
     * 解析参数
     * @param {string} url
     * @param {boolean} hexDecoding 16进制解码
     * @returns {any}
     */
    public static parseArguments = (url: string, hexDecoding: boolean): any => {

        let queryString: string = url.split("?")[0];

        if (!CommonUtils.hasText(queryString)) {
            return {};
        }
        if (hexDecoding && queryString.startsWith(DEFAULT_PARAM_KEY_NAME)) {
            queryString = StringToHexUtil.decode(queryString).split("=")[1];
        }


        return parse(queryString);
    }

}
