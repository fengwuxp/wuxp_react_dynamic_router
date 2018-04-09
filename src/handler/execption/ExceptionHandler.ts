import {Handler} from "../Handler";

/**
 * 异常处理器
 */
export abstract class ExceptionHandler implements Handler {

    handle = (e: any): void => {

        const {httpStatus} = e;

        switch (httpStatus) {

            case 400:
                this.handle400();
                break;
            case 401:
                this.handle401();
                break;
            case 403:
                this.handle403();
                break;
            case 404:
                this.handle404();
                break;
            case 500:
                this.handle500();
                break;
            default:
                console.error("未处理的异常", e);
        }
    };


    /**
     * 401
     */
    protected abstract handle400: () => void;

    /**
     * 401
     */
    protected abstract handle401: () => void;

    /**
     * 403
     */
    protected abstract handle403: () => void;

    /**
     * 处理404
     */
    protected abstract handle404: () => void;

    /**
     * 处理500
     */
    protected abstract handle500: () => void;
}

