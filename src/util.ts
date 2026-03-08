import type { JSX } from "react"

export function getAllByClassPrefix(prefix: string) {
    //@ts-ignore shush
    return [...document.querySelectorAll("[class]")].filter(el =>
        [...el.classList].some(cls => cls.startsWith(prefix))
    )
}
export function getByClassPrefix(prefix: string) {
    return getAllByClassPrefix(prefix)?.[0]
}

export function renderTo(parent: Element, element: JSX.Element) {
    wnd.Janitor.ReactDOM.createRoot(parent).render(element)
}

export function stringifyCyclic(value: unknown, maxDepth: number = 50): string {
  // Stack to detect cycles – holds objects currently being serialized.
  const stack: object[] = [];

  // Helper that does the actual work.
  function serialize(obj: unknown, depth: number = 0): string {
    // Depth limit check
    if (depth >= maxDepth) {
      return '[MaxDepthExceeded]';
    }

    // Handle primitives and special values
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (typeof obj === 'boolean') return obj.toString();
    if (typeof obj === 'number') {
      // JSON.stringify converts NaN/Infinity to null
      return isFinite(obj) ? obj.toString() : 'null';
    }
    if (typeof obj === 'string') return JSON.stringify(obj);
    if (typeof obj === 'function') return '[Function]';
    if (typeof obj === 'symbol') return '[Symbol]';
    if (typeof obj === 'bigint') return obj.toString() + 'n'; // optional

    // Handle Date objects – output ISO string (as JSON does)
    if (obj instanceof Date) return JSON.stringify(obj.toISOString());

    // Handle RegExp objects – output e.g. "/abc/g" as a string
    if (obj instanceof RegExp) return JSON.stringify(obj.toString());

    // For objects (including arrays) – check for cycles
    if (typeof obj === 'object') {
      // If already in stack, we have a cycle
      if (stack.includes(obj)) {
        return '[Circular]';
      }

      // Push current object onto the stack
      stack.push(obj);

      let result: string;
      if (Array.isArray(obj)) {
        // Serialize each array element, increasing depth
        const elements = obj.map((el) => serialize(el, depth + 1));
        result = '[' + elements.join(',') + ']';
      } else {
        // Plain object – serialize enumerable own properties
        const keys = Object.keys(obj);
        const pairs = keys.map((key) => {
          const keyStr = JSON.stringify(key); // quote the key
          const valStr = serialize((obj as Record<string, unknown>)[key], depth + 1);
          return keyStr + ':' + valStr;
        });
        result = '{' + pairs.join(',') + '}';
      }

      // Pop the object – we're done with this branch
      stack.pop();
      return result;
    }

    // Fallback (should never reach here)
    return String(obj);
  }

  return serialize(value);
}