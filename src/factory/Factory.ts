/**
 * 工厂
 */
export interface Factory {

    factory:(...params) => any;

    get:(...params) => any;
}
