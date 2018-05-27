##### 简化和规范 redux的使用

##### 使用说明


#####  1: 已装饰器的方式进行处理，不依赖打包配置 参见 test/handler

###### 2: 依赖constructor.name 所以在压缩打包时 uglifyJsPlugin需要如下设置：
            
            
                   /**
                     * keep_classnames（默认值：undefined） - 传递true以防止丢弃或改变类名称
                     */
                    keep_classnames: true,
            
                    /**
                     * keep_fnames（默认值：false） - 传递true以防止丢弃或改变函数名称。用于依赖于Function.prototype.name的代码。
                     * 如果最高级别minify选项keep_classnames未定义，则它将被顶级最小化选项keep_fnames的值覆盖。
                     */
                    keep_fnames: true,

###### 插件地址：https://github.com/webpack-contrib/uglifyjs-webpack-plugin

#####  参考配置：https://github.com/fengwuxp/wuxp_antd_mobile/blob/master/webpack/webpack.prod.config.template.ts

##### 示例：
             
             /**
              * 会话相关处理
              */
             export interface SessionHandler extends SagaHandler<AntdSession> {
             
                 login: (req, type?: string) => void;
             
                 logout: (type?: string) => void;
             
                 setSession: (state: AntdSession, newState?: AntdSession) => AntdSession;
             
             }
             
             
             let defaultSession = {
             
                 admin: null,
             
                 type: LoginType.ACCOUNT,
             
                 /**
                  * 登录状态
                  */
                 status: null,
             
                 /**
                  * 提交状态
                  */
                 submitting: false,
             
                 errorMessage: null
             
             };
             
             export class SessionHandlerImpl implements SessionHandler {
             
             
                 default: AntdSession = defaultSession;
             
             
                 /**
                  * 用户登录
                  * @param req
                  * @param {string}type
                  * @return {any}
                  */
                 @TargetAction(SessionHandlerImpl.prototype.setSession)
                 * login(req, type?: string): any {
             
                     try {
             
                         yield put({
                             type: type,
                             payload: {
                                 submitting: true
                             }
                         });
             
                         console.log("------登录请求参数-----------", req);
                         const {success, data, message, code}: ApiResp<AntdAdmin> = yield call(adminLogin, req);
             
                         if (success) {
                             //登录成功
                             setAuthority("user");
                             console.log("跳转到首页");
             
                             //跳转到首页
                             yield put(routerRedux.push('/'));
                             return {
                                 admin: data,
                                 status: SessionStatus.LOGIN_SUCCESS,
                                 submitting: false,
                                 type: LoginType.ACCOUNT,
                             };
                         } else {
                             console.log("登录请求失败");
                             console.log(`message-> ${message} , code->${code}`);
             
                             return {
                                 status: SessionStatus.LOGIN_ERROR,
                                 submitting: false,
                                 errorMessage: message,
                                 type: LoginType.ACCOUNT,
                             };
                         }
             
                     } catch (e) {
                         return {
                             status: SessionStatus.LOGIN_ERROR,
                             submitting: false,
                             type: LoginType.ACCOUNT,
                             errorMessage: "登录出现异常"
                         };
                     }
                 } ;
             
             
                 /**
                  * 退出
                  * @returns {IterableIterator<any>}
                  */
                 @TargetAction(SessionHandlerImpl.prototype.setSession)
                 * logout(type?: string): any {
                     console.log("退出登录");
                     yield call(adminLogout);
                     setAuthority("");
             
                     //回到登录页面
                     yield put(routerRedux.push('/login'));
             
                     return defaultSession;
                 }
             
                 setSession(state: AntdSession, newState?: AntdSession): AntdSession {
                     return newState;
                 };
             
             
             }
             
             
             function adminLogin(payload): Promise<ApiResp<AntdAdmin>> {
             
                 const {userName, password, captcha} = payload;
                 return apiClient.post({
                     url: "/login_json",
                     data: {
                         loginName: userName,
                         password,
                         captcha
                     },
                     useFilter: false
                 }).then((data) => {
                     return data
                 });
             }
             
             function adminLogout() {
             
                 apiClient.get({
                     url: "/logout",
                     useFilter: false
                 });
             
             }
             
             
             const sessionHandlerImpl = new SessionHandlerImpl();
             
             const session = createReducerByHandler<AntdSession>(sessionHandlerImpl);
             
             const sessionHandler = createReduxHandler<SessionHandler>(sessionHandlerImpl);
             
             export {
                 sessionHandler,
                 session
             }
             
##### 更多例子参考：https://github.com/fengwuxp/wuxp_antd_manager/tree/master/src/handler             



