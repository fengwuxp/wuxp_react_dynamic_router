import {Layout} from "../Layout";

/**
 * 导航layout
 */
export interface NavLayout extends Layout {

    /**
     * 折叠菜单
     * @param p
     */
    menuCollapse?: (...p) => void;

}
