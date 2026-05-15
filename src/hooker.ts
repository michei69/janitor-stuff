// haha
// hooker!
// ...get it?

import { hookReactCreateElement } from "./ui/hooker";

//* process define prop
export default function processDefineProp(obj: any, prop: any, descriptor: PropertyDescriptor & ThisType<any>) {
    // console.log(prop)
    if (typeof prop == "string") {
        // console.log(obj, prop)
        if (prop.includes("createElement")) {
            console.log("caught react obj")
            wnd.Janitor.React = obj
            wnd.Janitor.Hooks.ReactCreateElement = obj.createElement
            hookReactCreateElement()
        }
        else if (prop.includes("__esModule")) {
            wnd.Janitor.esModules.push(obj)
        }
    }
    if (typeof descriptor.value == "string" && descriptor.value == "Module") {
        // console.log(obj, prop, descriptor)
        wnd.Janitor.esModules.push(obj)
    }
}