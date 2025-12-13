declare global {
    var unsafeWindow: Window
    var wnd: Window // we create this

    var GM: {
        xmlHttpRequest: (...args) => {}
    }
}
export {}