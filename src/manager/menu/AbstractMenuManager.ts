import {MenuManager} from "./MenuManager";


/**
 * 抽象实现
 */
export default abstract class AbstractMenuManager<T> implements MenuManager<Promise<T>> {


    /**
     * 菜单列表
     */
    protected menus: T;


    async getMenus(...params): Promise<T> {

        if (this.menus === undefined) {
            this.menus = await this.initMenus(params);
        }
        return this.menus;
    };

    /**
     * 初始菜单
     * @param params
     * return {Promise<T>}
     */
    protected abstract initMenus: (...prams) => Promise<T> | T;

    /**
     * 切换菜单 当存在多模块是进行菜单切换
     * @param params
     */
    abstract switchMenu: (...params) => void;


    /**
     * 点击菜单项
     * @param params
     */
    abstract clickMenuItem: (...params) => void;

}
