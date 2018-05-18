import {SagaHandler} from "../redux/SagaHandler";
import {isNullOrUndefined} from "util";

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
        return target;

    }
}


export function DefaultAction(): any {

    return function (target: SagaHandler, name: string, descriptor: PropertyDescriptor): any {

        // console.log("---------target-------", target, name,action);
        target[name] = function (sate: any, newState: any) {
            return sate;
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
