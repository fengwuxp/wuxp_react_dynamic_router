import {ActionConfig} from "../../model/ActionConfig";
import {PromptType} from "../../enums/PromptType";
import {isUndefined} from "util";
import {History} from "history";
import {stringify} from "querystring";
import AbstractRouteHandler from "./AbstractRouteHandler";
import createBrowserHistory from "history/createBrowserHistory";

/**
 * web端基于react-router 的视图路由处理
 */
export default class WebReactRouteHandler extends AbstractRouteHandler {

    private history: History;


    constructor(history?: History) {
        super();
        this.history = createBrowserHistory({
            basename: process.env.BASE_NAME
        });
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
        this.history.push({
            pathname: path,
            state: data,
            search: stringify(prams)
        });
    };


}
