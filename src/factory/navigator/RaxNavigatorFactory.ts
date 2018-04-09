import {NavigatorFactory} from "./NavigatorFactory";


/**
 * rax 导航生成工厂
 */
export default class RaxNavigatorFactory implements NavigatorFactory{

    factory: <T>(...arguments) => T;


}
