/**
 * 会话管理器
 */
export interface SessionManager<T> {

    /**
     * 登录
     * @param params
     */
    login: (...params) => Promise<T>;

    /**
     * 退出
     */
    logout: () => Promise<T>;


    /**
     * 获取当前登录用户
     * @returns {T}
     */
    getCurrentMember: () => T;

    /**
     * 用户是否登录
     * @returns {boolean}
     */
    isLogin: () => boolean;
}
