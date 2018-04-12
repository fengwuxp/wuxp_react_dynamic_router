import {HttpExceptionHandler} from "./HttpExceptionHandler";
import {History} from "history";


//导航器
let history: History;

/**
 * 浏览器统一异常处理
 */
export default class WebHttpExceptionHandler extends HttpExceptionHandler {


    constructor(navigator: History) {
        super();
        history = navigator;
    }


    handle400 = () => {
        console.log("发生异常-> 404");
        history.push("/400");
    };

    handle401 = () => {
        console.log("发生异常-> 401");
        history.push("/401");
    };

    handle403 = () => {
        console.log("发生异常-> 403");
        history.push("/403");
    };

    handle404 = () => {
        console.log("发生异常-> 404");
        history.push("/404");
    };

    handle500 = () => {
        console.log("发生异常-> 500");
        history.push("/500");
    };


}
