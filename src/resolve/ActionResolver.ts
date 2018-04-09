/**
 * 动作解析
 */
export interface ActionResolver<T> {

    resolve: (...arguments) => Promise<T>;
}
