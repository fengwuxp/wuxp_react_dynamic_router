import {MenuManager} from "./MenuManager";

/**
 * 抽象实现
 */
export default abstract class AbstractMenuManager<T> implements MenuManager<T> {


    /**
     * 菜单列表
     */
    protected menus: T;


    getMenus = (...params): T => {
        if (this.menus === null) {
            const e = async () => {
                //初始化菜单列表
                await this.initMenus(params);
            };
            e();
        }
        return this.menus;
    };

    /**
     * 初始菜单
     * @param params
     * return {Promise<T>}
     */
    protected abstract initMenus: (...prams) => Promise<T>;

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
