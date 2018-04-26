/**
 * moment format string
 */
export enum MomentFormatString {

    /**
     * 格式化小时
     *  @type {string}
     */
    HH = "HH",

    /**
     * 格式化分钟
     * @type {string}
     */
    mm = "mm",

    /**
     * 格式化秒
     * @type {string}
     */
    ss = "ss",


    /**
     * 格式化年
     * @type {string}
     */
    YYYY = "YYYY",


    /**
     * 格式化月份
     * @type {string}
     */
    MM = "MM",

    /**
     * 格式化天
     * @type {string}
     */
    DD = "DD",


    /**
     * 格式化时分
     * @type {string}
     */

    HH_mm = "HH:mm",

    /**
     * 格式化时秒
     * @type {string}
     */

    HH_mm_ss = "HH:mm:ss",


    /**
     * 格式化月-天
     * @type {string}
     */
    MM_DD = "MM-DD",

    /**
     * 格式化月-天 时:分
     * @type {string}
     */
    MM_DD_HH_mm = "MM-DD HH:mm",


    /**
     * 格式化年月
     * @type {string}
     */
    YYYY_MM = "YYYY-MM",

    /**
     * 格式化年月日
     * 默认
     * @type {string}
     */
    YYYY_MM_DD = "YYYY-MM-DD",

    /**
     * 格式化年月日，小时
     * @type {string}
     */
    YYYY_MM_DD_HH = "YYYY-MM-DD HH",

    /**
     * 格式化年月日时分
     *  @type {string}
     */
    YYYY_MM_DD_HH_mm = "YYYY-MM-DD HH:mm",


    /**
     * 格式化年月日时分秒
     *  @type {string}
     */
    YYYY_MM_DD_HH_mm_ss = "YYYY-MM-DD HH:mm:ss"
}
