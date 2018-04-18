import {ActionConfig} from "../../model/admin/ActionConfig";
import {History} from "history";
import {stringify} from "querystring";
import AbstractRouteHandler from "./AbstractRouteHandler";

//导航器
let history: History;

/**
 * web端基于react-router 的视图路由处理
 */
export default class WebReactRouteHandler extends AbstractRouteHandler {

    constructor(navigator: History) {
        super();
        history = navigator;
    }

    handle = (action: ActionConfig, data: any): void => {

        this.route(action, data);
    };

    protected alter = (action: ActionConfig, data: any): Promise<any> => {

        return null;
    };
    protected confirm: (action: ActionConfig, data: any) => void;
    protected notice: (action: ActionConfig, data: any) => void;
    protected toast: (action: ActionConfig, data: any) => void;


    protected jump = (path: string, prams: any = {}, data = {}): void => {
        history.push({
            pathname: path,
            state: data,
            search: stringify(prams)
        });
    };


}
