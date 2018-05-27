import {SagaHandler} from "../../src/redux/SagaHandler";
import {TargetAction, DefaultAction, HandlerConstructor, GeneratorAction} from "../../src/decorator/TargetReduxAction";
import {createReducerByHandler, createReduxHandler} from "../../src/redux/ProxyReduxAction";


interface TestData {

}

export interface SessionHandler extends SagaHandler<TestData> {

    login: (req, type?: string) => void;

    logout: (type?: string) => void;

    setSession: (state: TestData, newState?: TestData) => void;

}


let defaultSession = {};

@HandlerConstructor({
    name:"SessionHandlerImpl"
})
export class SessionHandlerImpl implements SessionHandler {


    default: TestData = defaultSession;


    /**
     * 注：如果被DefaultAction标记的方法有被TargetAction引用，一定要将该方法放到前面，
     * 或者自行实现
     */
    @DefaultAction()
    setSession: (state: TestData, newState?: TestData) => void;


    // setSession(state: TestData, newState?: TestData): TestData {
    //     return newState;
    // };


    @GeneratorAction(SessionHandlerImpl.prototype.setSession)
    * login(req, type?: string): any {


    } ;



    @TargetAction(SessionHandlerImpl.prototype.setSession)
    * logout(type?: string): any {


        return defaultSession;
    }




}


const sessionHandlerImpl = new SessionHandlerImpl();

const session = createReducerByHandler<TestData>(sessionHandlerImpl);

const sessionHandler = createReduxHandler<SessionHandler>(sessionHandlerImpl);

export {
    sessionHandler,
    session
}
