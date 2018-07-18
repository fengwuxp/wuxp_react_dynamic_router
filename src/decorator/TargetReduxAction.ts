import {SagaHandler} from "../redux/SagaHandler";
import {isArray, isNullOrUndefined, isObject} from "util";


export interface HandlerConstructorOptions {

    /**
     * 构造器的名称
     */
    name: string;
}


/**
 * handler构造
 * @param {HandlerConstructorOptions} options
 * @return {(constructor: T) => T}
 * @constructor
 */
export function HandlerConstructor<T extends { new(...args: any[]): any }>(options: HandlerConstructorOptions) {
    /**
     * decorator
     * @param  {T} constructor
     */
    return (constructor: T): T => {

        return class extends constructor {

            public generatorFunctionNames: string[] = [];

            public actionNames = new Map<string, string>();

            public constructorName: string = options.name;

        }
    }
}

/**
 * 标记方法为一个generator函数，不依赖构造方法的判断
 * @param {Function} action
 * @constructor
 */
export function GeneratorAction(action: Function) {

    /**
     * decorator
     * @param  {SagaHandler} target              装饰的属性所述的类的原型，注意，不是实例后的类。如果装饰的是 SagaHandler 的某个属性，这个 target 的值就是 SagaHandler.prototype
     * @param  {string} name                     装饰的属性的 key
     * @param  {PropertyDescriptor} descriptor   装饰的对象的描述对象
     */
    return function (target: SagaHandler, name: string, descriptor: PropertyDescriptor): any {

        addGeneratorFunction(target, name);

        addActionNameMaps(target, name, action.name);
        return target;

    }
}


/**
 * 期望执行的目标action
 * @param {Function} action
 * @return {(target, name, descriptor) => any}
 * @constructor
 */
export function TargetAction(action: Function): any {

    /**
     * decorator
     * @param  {SagaHandler} target              装饰的属性所述的类的原型，注意，不是实例后的类。如果装饰的是 SagaHandler 的某个属性，这个 target 的值就是 SagaHandler.prototype
     * @param  {string} name                     装饰的属性的 key
     * @param  {PropertyDescriptor} descriptor   装饰的对象的描述对象
     */
    return function (target: SagaHandler, name: string, descriptor: PropertyDescriptor): any {

        console.log("---------target-------", target, name, action);

        addActionNameMaps(target, name, action.name);


        addGeneratorFunction(target, name);

        return target;

    }
}

/**
 * 默认的action，总是会返回新的state
 * @return {any}
 * @constructor
 */
export function DefaultAction(): any {

    return function (target: SagaHandler, name: string, descriptor: PropertyDescriptor): any {

        // console.log("---------target-------", target, name);
        target[name] = function (state: any, newState: any) {
            if (isArray(state)) {
                return Object.assign(state,newState);
            } else if (isObject(state)) {

                return {
                    ...state,
                    ...newState
                };
            } else {
                return newState;
            }

        };
        addActionNameMaps(target, name, name);

        return target[name];

    }
}

function addActionNameMaps(target: SagaHandler, name: string, action: string) {
    if (isNullOrUndefined(target.actionNames)) {
        target.actionNames = new Map<string, string>();
    }
    target.actionNames.set(name, action);
}


/**
 * 添加一个generator方法
 * @param {SagaHandler} target
 * @param {string} name
 */
function addGeneratorFunction(target: SagaHandler, name: string) {
    // if (isNullOrUndefined(target.generatorFunctionNames)) {
    //     target.generatorFunctionNames = [];
    // }
    // target.generatorFunctionNames.push(name);
    //添加 generator 函数的标记
    target[name].generatorFunction = true;
}
