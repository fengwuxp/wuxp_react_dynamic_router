/*
* 深层次对象值获取代理
* 例如 a.b.c.z  如果b,c 都有可能null 在获取的时候要做太多的判断
* */

import {isNullOrUndefined, isObject} from "util";

export function deepObjectGetterProxy<T extends object>(obj: T): T {
    if (obj == null) {
        return null;
    }
    return new DeepObjectGetterProxy<T>().builder(obj);
}

//空值代理getter
let NULL_PROXY_GETTER = null;

class DeepObjectGetterProxy<T extends object> {


    constructor() {
    }

    builder(source: T) {
        let handler: ProxyHandler<T> = {
            get: (target: T, p: PropertyKey, receiver: any): any => {
                // console.log("-->receiver",receiver)
                if ((p as string).indexOf(".") > 0) {
                    return this.getValueByStringKey(target, p as string)
                } else {
                    return this.getValue(target, p)
                }
            }

        };
        return new Proxy(source, handler)
    };

    getValueByStringKey = (target: T, key: string): any => {
        const keys = key.split(".");
        let prev = target;
        for (let i = 0; i < keys.length; i++) {
            prev = prev[keys[i]];
            if (isNullOrUndefined(prev)) {
                return prev;
            }
        }
    };

    getValue = (target: T, key: PropertyKey) => {
        let targetElement = target[key];
        if (isNullOrUndefined(targetElement)) {
            return targetElement;
        } else if (isObject(targetElement)) {
            return this.builder(targetElement);
        } else {
            return targetElement;
        }

    };

    /**
     * TODO 空值的获取的 getter
     * @param targetElement
     * @param isFirst 是否为第一次
     * @return {{}}
     */
    nullProxyGetter = (targetElement, isFirst) => {


        if (!isFirst) {
            return targetElement;
        }


        if (NULL_PROXY_GETTER === null) {
            let handler: ProxyHandler<T> = {
                get: (target: T, p: PropertyKey, receiver: any): any => {

                    return this.nullProxyGetter(targetElement, false)
                }
            };

            //返回一个代理对象
            NULL_PROXY_GETTER = new Proxy({}, handler);
        }
        return NULL_PROXY_GETTER;
    }

}
