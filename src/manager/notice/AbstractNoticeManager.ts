import {NoticeManager} from "./NoticeManager";

export default abstract class AbstractNoticeManager<T> implements NoticeManager<T> {

    /**
     * 消息通知列表
     */
    protected messageList: T = null;


    getNotices = (...params): T => {
        if (this.messageList === null) {
            const e = async () => {
                //初始化消息列表
                await this.initNotices(params);
            };
            e();
        }
        return this.messageList;
    };


    abstract clearNotices: () => void;


    /**
     * 初始化通知消息列表
     * return {T}
     */
    protected abstract initNotices: (...params) => Promise<T>;


    /**
     * 从服务端更新通知消息
     */
    protected abstract updateNoticeByRemote?: (...params) => void;


    /**
     * 改变通知消息状态
     */
    protected abstract changeNoticeStatus: (...params) => void;
}
