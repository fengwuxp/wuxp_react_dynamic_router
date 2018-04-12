import {Manager} from "../Manager";

/**
 * 消息通知管理
 */
export interface NoticeManager<T> extends Manager<T> {

    /**
     * 获取通知消息列表
     * @param params
     * @returns {T}
     */
    getNotices: (...params) => T;


    /**
     * 清空消息列表
     */
    clearNotices: () => void;

}
