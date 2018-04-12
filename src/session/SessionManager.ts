/**
 * 会话管理器
 */
export interface SessionManager<T> {

    /**
     * 登录
     * @param params
     */
    login: (...params) => void;

    /**
     * 退出
     */
    logout: () => void;


    /**
     * 获取当前登录用户
     * @returns {T}
     */
    getCurrentMember: () => T;
}
