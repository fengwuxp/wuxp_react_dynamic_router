import {NavigatorFactory} from "./NavigatorFactory";
import createBrowserHistory, {BrowserHistoryBuildOptions} from "history/createBrowserHistory";
import {History} from "history";

let browserHistory: History = null;

/**
 * 浏览器导航器
 */
class BrowseRNavigatorFactory implements NavigatorFactory {

    /**
     * 生成一个
     * @param {BrowserHistoryBuildOptions} options
     * @returns {any}
     */
    factory = (options: BrowserHistoryBuildOptions = {
        basename: process.env.BASE_NAME
    }) => {
        if (browserHistory !== null) {
            return browserHistory;
        }

        browserHistory = createBrowserHistory(options);

        return browserHistory;
    };

    get = (): History => {
        return browserHistory;
    };


}

export default new BrowseRNavigatorFactory();
