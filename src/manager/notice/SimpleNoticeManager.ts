import AbstractNoticeManager from "./AbstractNoticeManager";

/**
 * 简单的消息通知管理
 */
export default class SimpleNoticeManager extends AbstractNoticeManager<Array<any>> {

    protected changeNoticeStatus: (...params) => void;

    protected initNotices: (...params) => Promise<Array<any>>;

    protected updateNoticeByRemote: (...params) => void;


}
