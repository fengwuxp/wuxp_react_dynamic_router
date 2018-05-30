import {NamedRouteConfig} from "../model/route/NamedRouteConfig";


const routes: NamedRouteConfig[] = [];

export function registerRouteByEnd(route: NamedRouteConfig) {

    routes.push(route)
}

export function registerRouteByBegin(route: NamedRouteConfig) {

    routes.unshift(route)
}

export function getRoutes() {
    return routes;
}
