import * as  WeexEnvUtil from "typescript_api_sdk/src/utils/WeexEnvUtil"

const isAndroid: boolean = WeexEnvUtil.isAndroid();

const isIos: boolean = WeexEnvUtil.isIos();

/**
 * ios 项目名称
 * @type {string}
 */
const iosProjectName = process.env.IOS_PROJECT_NAME;

/**
 * android js 文件目录
 * @type {string}
 */
const androidJsDir: string = process.env.ADNROD_JS_DIR ? process.env.ADNROD_JS_DIR : "file://assets/js";

/**
 * 协议名称，http或 https
 * @type {string}
 */
const protocolName: string = process.env.USE_HTTPS ? "https" : "http";

/**
 * 构建资源完整的url
 * @param {string} uri 资源路径
 * @returns {string}
 */
export function buildResourceByURI(uri: string): string {

    let nativeBase: string;

    if (isAndroid) {
        nativeBase = androidJsDir;
    } else if (isIos) {
        const bundleUrl: string = location.href;
        nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf(iosProjectName + '/')) + iosProjectName + "/bundlejs";
    } else {
        let host = process.env.BASE_DOMAIN + '/weex/' + process.env.WEB_DEPLOYMENT_DIRECTORY + '/';
        nativeBase = `${protocolName}://${host}`
    }

    if (uri.startsWith("/")) {
        return `${nativeBase}${uri}`;
    } else {
        return `${nativeBase}/${uri}`;
    }

}
