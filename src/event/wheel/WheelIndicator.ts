

interface WheelIndicatorOptions {

    /**
     * 监听事件的元素
     */
    element: HTMLElement;

    /**
     * 阻止默认行为
     */
    preventMouse?: boolean;

    /**
     * 处理者
     */
    handle: WheelIndicatorHandler;

}

/**
 * 滚动方向
 */
type WheelDirection = "up" | "down";

/**
 * 鼠标滚动处理者
 */
export type WheelIndicatorHandler = (e: {
    direction: WheelDirection
}, event: MouseWheelEvent) => void;

/**
 * 鼠标滚动事件指示器
 * see https://github.com/Promo/wheel-indicator
 */
export default class WheelIndicator {

    /**
     * 滚动事件事件名称
     */
    private eventWheel: string;

    /**
     * 是否进行事件处理
     */
    private isWorking: boolean = true;

    private options: WheelIndicatorOptions;

    /**
     * 滚动处理者
     */
    private wheelHandler: WheelEventHandler;

    constructor(options: WheelIndicatorOptions) {
        this.eventWheel = 'onwheel' in document ? 'wheel' : 'mousewheel';
        this.options = options;
        this.wheelHandler = new WheelEventHandler([options.handle]);

        //添加处理
        this.wheelHandler.addEvent(this.options.element, this.eventWheel, this.wheelHandle);
    }


    /**
     * 开启
     */
    public turnOn = () => {
        this.isWorking = true;
        return this;
    };

    /**
     * 关闭
     */
    turnOff = () => {
        this.isWorking = false;
        return this;
    };

    /**
     * 销毁
     */
    destroy = () => {
        this.wheelHandler.removeEvent(this.options.element, this.eventWheel, this.wheelHandler);
        this.wheelHandler = null;
    };

    /**
     * 处理滚动
     * @param event
     */
    private wheelHandle = (event: MouseWheelEvent) => {
        if (!this.isWorking) {
            //不进行事件处理
            return;
        }

        this.wheelHandler.processDelta(event);

        if (this.options.preventMouse) {
            this.wheelHandler.preventDefault(event);
        }
    };

}


/**
 * 鼠标滚动事件处理这里
 */
class WheelEventHandler {

    private deltaArray: number[] = [0, 0, 0];

    /**
     * 滚动方向
     */
    private direction: WheelDirection;


    /**
     * 定时器持有者
     */
    private timer: any;

    /**
     * 是否滚动是否停止
     */
    private isStopped: boolean;

    private isAcceleration: boolean;

    /**
     * 事件处理列表
     */
    private handles: WheelIndicatorHandler[] = [];


    constructor(handles: WheelIndicatorHandler[]) {
        this.handles = handles;
    }

    /**
     * 阻止默认行为
     * @param event
     */
    public preventDefault = (event: MouseEvent) => {
        event = event || window.event as MouseEvent;

        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };

    /**
     * 处理滚动距离
     * @param event
     */
    public processDelta = (event: MouseWheelEvent) => {
        let delta = this.getDeltaY(event);

        if (delta === 0) {
            return
        }

        let direction: WheelDirection = delta > 0 ? 'down' : 'up',
            arrayLength = this.deltaArray.length,
            changedDirection = false,
            repeatDirection = 0,
            sustainableDirection, i;

        //清除定时器
        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.deltaArray = [0, 0, 0];
            this.isStopped = true;
            this.direction = direction;
        }, 150);

        //check how many of last three deltas correspond to certain direction
        for (i = 0; i < arrayLength; i++) {
            if (this.deltaArray[i] !== 0) {
                this.deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
            }
        }

        //if all of last three deltas is greater than 0 or lesser than 0 then direction is switched
        if (Math.abs(repeatDirection) === arrayLength) {
            //determine type of sustainable direction
            //(three positive or negative deltas in a row)
            sustainableDirection = repeatDirection > 0 ? 'down' : 'up';

            if (sustainableDirection !== this.direction) {
                //direction is switched
                changedDirection = true;
                this.direction = direction;
            }
        }

        //if wheel`s moving and current event is not the first in array
        if (!this.isStopped) {
            if (changedDirection) {
                this.isAcceleration = true;

                this.triggerEvent(event);
            } else {
                //check only if movement direction is sustainable
                if (Math.abs(repeatDirection) === arrayLength) {
                    //must take deltas to don`t get a bug
                    //[-116, -109, -103]
                    //[-109, -103, 1] - new impulse

                    this.analyzeArray(event);
                }
            }
        }

        //if wheel is stopped and current delta value is the first in array
        if (this.isStopped) {
            //滚动已经停止
            this.isStopped = false;
            this.isAcceleration = true;
            this.direction = direction;

            this.triggerEvent(event);
        }

        this.deltaArray.shift();
        this.deltaArray.push(delta);
    };

    /**
     * 添加事件
     * @param elem
     * @param type
     * @param handler
     */
    public addEvent = (elem, type, handler) => {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, handler);
        }
    };

    /**
     * 移除事件
     * @param elem
     * @param type
     * @param handler
     */
    public removeEvent = (elem, type, handler) => {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, handler);
        }
        //清除定时器
        clearTimeout(this.timer);
    };


    // public addHandle = (handle: WheelIndicatorHandler) => {
    //     this.handles.push(handle);
    // };
    //
    // public removeHandle = (index) => {
    //     this.handles.slice(index, 1);
    // };

    /**
     * 解析事件
     * @param event
     */
    private analyzeArray = (event: MouseWheelEvent) => {
        let
            deltaArray0Abs = Math.abs(this.deltaArray[0]),
            deltaArray1Abs = Math.abs(this.deltaArray[1]),
            deltaArray2Abs = Math.abs(this.deltaArray[2]),
            deltaAbs = Math.abs(this.getDeltaY(event));

        if ((deltaAbs > deltaArray2Abs) &&
            (deltaArray2Abs > deltaArray1Abs) &&
            (deltaArray1Abs > deltaArray0Abs)) {

            if (!this.isAcceleration) {
                this.triggerEvent(event);
                this.isAcceleration = true;
            }
        }

        if ((deltaAbs < deltaArray2Abs) &&
            (deltaArray2Abs <= deltaArray1Abs)) {
            this.isAcceleration = false;
        }
    };


    /**
     * 触发事件
     * @param event
     */
    private triggerEvent = (event) => {
        // event.direction = this.direction;
        this.handles.forEach((handle) => {
            handle({
                direction: this.direction
            }, event)
        });
    };

    /**
     * 获取y轴方向上的距离
     * @param event
     */
    private getDeltaY = (event: MouseWheelEvent) => {
        let handle;
        if (event.wheelDelta && !event.deltaY) {
            handle = function (event) {
                return event.wheelDelta * -1;
            };
        } else {
            handle = function (event) {
                return event.deltaY;
            };
        }

        return handle(event);
    };


}
