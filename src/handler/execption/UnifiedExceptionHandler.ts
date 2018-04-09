import {ExceptionHandler} from "./ExceptionHandler";
import {History} from "history";


//导航器
let history: any;

/**
 * 统一异常处理
 */
export default class UnifiedExceptionHandler extends ExceptionHandler {


    constructor(navigator: History) {
        super();
        history = navigator;
    }


    protected handle400 = () => {
        console.log("发生异常-> 404")
    };

    protected handle401 = () => {
        console.log("发生异常-> 401")
    };

    protected handle403 = () => {
        console.log("发生异常-> 403")
    };

    protected handle404 = () => {
        console.log("发生异常-> 404")
    };

    protected handle500 = () => {
        console.log("发生异常-> 500")
    };


}
