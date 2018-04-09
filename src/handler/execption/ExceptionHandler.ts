/**
 * 异常处理器
 */
import {Handler} from "../Handler";

export abstract class ExceptionHandler extends Handler{

    abstract handle: (...arguments) => void;

}
