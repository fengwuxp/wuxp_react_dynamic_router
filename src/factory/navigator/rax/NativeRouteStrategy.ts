import {buildResourceByURI} from "../../../utils/RaxBuildResourcePathUtil";


const packageName: string = navigator.appName;
// if (packageName === null || packageName === undefined || packageName.toString().trim().length === 0) {
//     packageName = weex.config.env.appName;
// }


/**
 * 原生路由策略
 */
export default class NativeRouteStrategy {


    /**
     * 生成原生环境下的js路径
     * @param {string} path
     * @param {boolean} main
     * @returns {string}
     */
    static generateNativeJSPath = (path: string, main: boolean): string => {

        return buildResourceByURI(`weex://${packageName}/${(main ? 'main' : 'page')}/${path}.js`);

    }

}






