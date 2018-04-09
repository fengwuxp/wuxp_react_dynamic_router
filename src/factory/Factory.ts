/**
 * 工厂
 */
export interface Factory {

    factory: <T>(...arguments) => T;
}
