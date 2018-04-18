import {NoticeManager} from "./NoticeManager";

export default abstract class AbstractNoticeManager<T> implements NoticeManager<Promise<T>> {

    /**
     * 消息通知列表
     */
    protected messageList: T;


    async getNotices(...params): Promise<T> {
        if (this.messageList === undefined) {
            this.messageList = await this.initNotices(params);
        }
        return this.messageList;
    };


    abstract clearNotices: () => void;


    /**
     * 初始化通知消息列表
     * return {T}
     */
    protected abstract initNotices: (...params) => Promise<T> | T;


    /**
     * 从服务端更新通知消息
     */
    protected abstract updateNoticeByRemote?: (...params) => void;


    /**
     * 改变通知消息状态
     */
    protected abstract changeNoticeStatus: (...params) => void;
}
