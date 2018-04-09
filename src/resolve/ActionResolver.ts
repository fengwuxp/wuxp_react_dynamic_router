/**
 * 动作解析
 */
export interface ActionResolver {

    resolve: (...params) => Promise<any>|void;
}
