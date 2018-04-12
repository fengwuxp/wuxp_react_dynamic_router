import AbstractMenuManager from "./AbstractMenuManager";


/**
 * 简单的菜单管理器
 */
export default class SimpleMenuManager extends AbstractMenuManager<Array<any>> {


    clickMenuItem: (...params) => void;


    protected initMenus = (...prams): Promise<Array<any>> => {

        return null;
    };


    switchMenu: (...params) => void;


}
