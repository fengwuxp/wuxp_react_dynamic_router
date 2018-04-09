import {isUndefined} from "util";


const id = isUndefined(process.env.ACTION_HANDLER_CONFIG) ? "../../../../config/ActionHandlerConfig" : process.env.ACTION_HANDLER_CONFIG;
const handler = require(id);

export default handler;
