/**
 * @packageDocumentation
 * @module veldt
 * @description This module contains all the functions to create and render elements.
 * @preferred
 * @example
 * import veldt from 'veldt';
 * const App = () => {
 * return veldt.createElement('div', {className: 'app'}, 'Hello World!');
 * }
 * veldt.render(veldt.createElement(App, null), document.getElementById('root'));
 * @example
 * import veldt from 'veldt';
 * const App = () => {
 *  return <div className="app">Hello World!</div>;
 * }
 * veldt.render(<App />, document.getElementById('root'));
 **/

/**
 * polyfill
 * @description polyfills the document object. This is needed for server side rendering.
 * @param document
 * @returns void
 * @example
 * import veldt from 'veldt';
 * import { JSDOM } from 'jsdom';
 * const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>');
 * veldt.polyfill(dom.window.document);
 * const App = () => {
 * return <div className="app">Hello World!</div>;
 * }
 * veldt.renderToString(<App />);
 **/
const polyfill = (document: any) => {
  globalThis.document = document;
};
/**
 * stores all side effects to use on render
 */
const effects: any[] = [];

/**
 * createElement
 * @description creates an element. Essentially a wrapper for document.createElement.
 * @param type
 * @param props
 * @param children
 * @returns HTMLElement | Text Node
 */
const createElement = (
  type: string | Function,
  props: Record<string, any>,
  ...children: any[]
): HTMLElement | any => {
  if (typeof type === "function") {
    if (props && props?.ref) {
      props.ref.current = type(props, children);
      return props.ref.current;
    }
    return type(props, children);
  }
  const element = document.createElement(type);
  props &&
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on")) {
        element.addEventListener(key.substring(2).toLowerCase(), props[key]);
        return;
      }
      if (key === "className") {
        element.setAttribute("class", props[key]);
        return;
      }
      if (key === "style") {
        Object.keys(props[key]).forEach((styleKey: any) => {
          element.style[
            styleKey.replace(/-([a-z])/g, (g: any) => {
              return g[1].toUpperCase();
            })
          ] = props[key][styleKey];
        });
        return;
      }
      if (key === "ref") {
        props[key].current = element;
        return;
      }
      element.setAttribute(key, props[key]);
    });
  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      if (child instanceof HTMLElement || child instanceof Text) {
        element.appendChild(child);
        return;
      } else {
        element.appendChild(document.createTextNode(child));
      }
    }
  });
  return element;
};

/**
 * Fragment
 * @description creates a document fragment. Essentially a wrapper for document.createDocumentFragment.
 * @param props
 * @param children
 * @returns DocumentFragment
 */
const Fragment = (props: any, children: any[]) => {
  const fragment = document.createDocumentFragment();

  children.forEach((child) => {
    if (typeof child === "string") {
      fragment.appendChild(document.createTextNode(child));
    } else {
      fragment.appendChild(child);
    }
  });
  return fragment;
};

/**
 * render
 * @description renders an element to a container. If the element is null, it will remove the first child of the container. Also runs all side effects after rendering.
 * @param element HTMLElement | Text Node | null
 * @param container HTMLElement
 */
const render = (element: HTMLElement, container: HTMLElement) => {
  if (element === null) {
    if (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  } else {
    if (container.firstChild) {
      container.replaceChild(element, container.firstChild);
    } else {
      container.appendChild(element);
    }
  }
  effects.pop()?.callback();
};

/**
 * insertBefore
 * @description inserts an element before another element.
 * @param newNode
 * @param referenceNode
 * @returns void
 **/
const insertBefore = (newNode: HTMLElement, referenceNode: HTMLElement) => {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode);
};

/**
 * insertAfter
 * @description inserts an element after another element.
 * @param newNode
 * @param referenceNode
 * @returns void
 **/
const insertAfter = (newNode: HTMLElement, referenceNode: HTMLElement) => {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
};

/**
 * renderToString
 * @description renders an element to a string.
 * @param element HTMLElement | Text Node
 * @returns string
 */
const renderToString = (element: HTMLElement) => {
  const container = document.createElement("div");
  container.appendChild(element);
  return container.innerHTML;
};

/**
 * effect
 * @description Use this functions to create side effects. It will run all side effects after rendering.
 * @param callback
 */
const effect = (callback: Function) => {
  effects.push({ callback });
};

/**
 * uuid
 * @description creates a unique id
 * @returns string
 */
const uuid = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * ref
 * @description creates a reference
 * @param val
 * @returns object
 */
const ref = <T>(val: T) => {
  return { current: val };
};

// hmr on dev
if (process.env.NODE_ENV === "development") {
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload()
  );
}

const veldt = {
  polyfill,
  createElement,
  Fragment,
  render,
  renderToString,
  insertBefore,
  insertAfter,
  effect,
  uuid,
  ref,
};

export default veldt;
