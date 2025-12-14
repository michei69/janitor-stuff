import esbuild from "esbuild";
import userscriptHeaderPlugin from "./plugins/userscript";
import { externalGlobalPlugin } from 'esbuild-plugin-external-global'

(async () => {
    //! hacks
    const jsxShim = 
`{
    jsx: (...args) => wnd.Janitor.ReactJSX.jsx(...args),
    jsxs: (...args) => wnd.Janitor.ReactJSX.jsxs(...args),
    Fragment: (...args) => wnd.Janitor.ReactJSX.Fragment(...args)
}`
    const reactShim = 
`{
    cloneElement: (...args) => wnd.Janitor.React.cloneElement(...args),
    createContext: (...args) => wnd.Janitor.React.createContext(...args),
    createElement: (...args) => wnd.Janitor.React.createElement(...args),
    createFactory: (...args) => wnd.Janitor.React.createFactory(...args),
    createRef: (...args) => wnd.Janitor.React.createRef(...args),
    forwardRef: (...args) => wnd.Janitor.React.forwardRef(...args),
    isValidElement: (...args) => wnd.Janitor.React.isValidElement(...args),
    lazy: (...args) => wnd.Janitor.React.lazy(...args),
    memo: (...args) => wnd.Janitor.React.memo(...args),
    startTransition: (...args) => wnd.Janitor.React.startTransition(...args),
    useDeferredValue: (...args) => wnd.Janitor.React.useDeferredValue(...args),
    useInsertionEffect: (...args) => wnd.Janitor.React.useInsertionEffect(...args),
    useSyncExternalStore: (...args) => wnd.Janitor.React.useSyncExternalStore(...args),
    useEffect: (...args) => wnd.Janitor.React.useEffect(...args),
    useState: (...args) => wnd.Janitor.React.useState(...args),
    useRef: (...args) => wnd.Janitor.React.useRef(...args),
    useContext: (...args) => wnd.Janitor.React.useContext(...args),
    useReducer: (...args) => wnd.Janitor.React.useReducer(...args),
    useCallback: (...args) => wnd.Janitor.React.useCallback(...args),
    useMemo: (...args) => wnd.Janitor.React.useMemo(...args),
    useLayoutEffect: (...args) => wnd.Janitor.React.useLayoutEffect(...args),
    useDebugValue: (...args) => wnd.Janitor.React.useDebugValue(...args),
    useImperativeHandle: (...args) => wnd.Janitor.React.useImperativeHandle(...args),
    useId: (...args) => wnd.Janitor.React.useId(...args),
    useTransition: (...args) => wnd.Janitor.React.useTransition(...args)
}`
    const reactDOMShim = 
`{
    createPortal: (...args) => wnd.Janitor.ReactDOM.createPortal(...args),
    createRoot: (...args) => wnd.Janitor.ReactDOM.createRoot(...args),
    findDOMNode: (...args) => wnd.Janitor.ReactDOM.findDOMNode(...args),
    flushSync: (...args) => wnd.Janitor.ReactDOM.flushSync(...args),
    unmountComponentAtNode: (...args) => wnd.Janitor.ReactDOM.unmountComponentAtNode(...args),
    hydrateRoot: (...args) => wnd.Janitor.ReactDOM.hydrateRoot(...args),
    hydrate: (...args) => wnd.Janitor.ReactDOM.hydrate(...args),
    render: (...args) => wnd.Janitor.ReactDOM.render(...args)
}`

    //* actual build stuff
    const watch = process.argv.includes('--watch');
    const data = {
        entryPoints: ['src/index.ts'],
        bundle: true,
        external: ["react", "react-dom", "react/jsx-runtime"],
        minify: !watch,
        outfile: watch ? "dist/index-dev.user.js" : "dist/index.user.js",
        plugins: [
            userscriptHeaderPlugin(),
            externalGlobalPlugin({
                "react": reactShim,
                "react-dom": reactDOMShim,
                "react/jsx-runtime": jsxShim
            })
        ]
    }

    if (watch) {
        const ctx = await esbuild.context(data)
        await ctx.watch()
    } else {
        await esbuild.build(data)
    }
})()