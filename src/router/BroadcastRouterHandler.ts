import BroadcastPlugin from "typescript_api_sdk/src/plugins/broadcast/BroadcastPlugin"


const broadcastPlugin: BroadcastPlugin = new BroadcastPlugin();


export interface BroadcastRoute {
    path: string,
    params: any
}

const changeRouter: string = "change_router";
const routerBroadcast: string = "router_broadcast";

//标记位，只有broadcastNumber=0的时候才会接受广播
let broadcastNumber: number = 0;

/**
 * 通过广播进行路由改
 */
export default class BroadcastRouterHandler {


    //当接收了一次通知后，最快在3秒后才会再次接受通知
    private times: number;

    constructor(times: number = 3000) {
        this.times = times;
    }

    /**
     * 发送路由跳转消息
     * @param {string} path
     * @param params
     */
    sendJumpMessage = (path: string, params: any) => {

        this.sendMessage([{path, params}]);
    };


    /**
     * 发送路由跳转消息
     * @param {Array<BroadcastRoute>} routes
     */
    sendJumpRoutes = (routes: Array<BroadcastRoute>) => {
        this.sendMessage(routes);
    };


    /**
     * 监听路由广播
     * @returns {Promise<any>}
     */
    monitorRoutingBroadcast = (): Promise<Array<BroadcastRoute>> => {

        return new Promise<Array<BroadcastRoute>>((resolve, reject) => {
            broadcastPlugin.register(routerBroadcast, changeRouter, ({data}) => {
                resolve(data);
            });
        });
    };

    private sendMessage = (routes: Array<BroadcastRoute>) => {

        if (broadcastNumber > 0) {
            return;
        }
        broadcastNumber++;
        broadcastPlugin.send(routerBroadcast, changeRouter, routes, null);
        setTimeout(() => {
            broadcastNumber--;
        }, this.times);
    }
}
