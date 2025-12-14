// this fuckass script spams the console because i have ublock
// js kys already
export async function disableEventLogger() {
    while (
        typeof wnd.__STATSIG__ == "undefined" || 
        typeof wnd.__STATSIG__.instances == "undefined" || 
        Object.values(wnd.__STATSIG__.instances).length == 0
    ) await new Promise(resolve => setTimeout(resolve, 100));

    for (let instance of Object.values(wnd.__STATSIG__.instances)) {
        (instance as any).shutdown();
        (instance as any)._logger.reset();
        (instance as any)._logger.stop();
        (instance as any)._logger._sdkKey = "";
        (instance as any)._logger._sendEvents = null
    }
}