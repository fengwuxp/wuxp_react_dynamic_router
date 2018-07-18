// import {ReduxAction} from "./ReduxAction";

/**
 * saga handler
 */
export interface SagaHandler<T=any> {

    /**
     * 默认情况的数据
     */
    default: T,


    /**
     * 保存action 方法 和 saga 方法发关系
     */
    actionNames?: Map<string, string>;

    /**
     * generator 函数方法的名称
     */
    // generatorFunctionNames?: string[];

    /**
     * 构造器名称
     */
    constructorName?: string;


    // [key: string]: (...p) => ReduxAction<T>;
}

export type Props<P, K extends keyof P> = ((prevState: Readonly<P>) => (Pick<P, K> | P | null)) | (Pick<P, K> | P | null)

export interface PropsHandler<P> {
    setProps<K extends keyof P>(
        state: Props<P, K>,
        newState?: P
    ): P
}
