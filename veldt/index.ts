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
      if (key === "style" && typeof props[key] === "object") {
        function toSnakeCase(inputString: string) {
          return inputString
            .split("")
            .map((character) => {
              if (character == character.toUpperCase()) {
                return "-" + character.toLowerCase();
              } else {
                return character;
              }
            })
            .join("") as any;
        }
        Object.keys(props[key]).forEach((styleKey: string) => {
          element.style[toSnakeCase(styleKey)] = props[key][styleKey];
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
    } else if (
      child instanceof HTMLElement ||
      child instanceof Text ||
      child instanceof DocumentFragment ||
      child instanceof Element
    ) {
      fragment.appendChild(child);
    } else if (child instanceof Array) {
      child.forEach((c) => {
        if (typeof c === "string") {
          fragment.appendChild(document.createTextNode(c));
        } else if (
          c instanceof HTMLElement ||
          c instanceof Text ||
          c instanceof DocumentFragment ||
          c instanceof Element
        ) {
          fragment.appendChild(c);
        } else {
          fragment.appendChild(document.createTextNode(c));
        }
      });
    } else {
      fragment.appendChild(document.createTextNode(child));
      console.log(child);
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
    //replace all children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(element);
  }
  effects.pop()?.callback();
};

/**
 * insertBefore
 * @description inserts an element into an element, inserts before existing children.
 * @param newNode
 * @param referenceNode
 * @returns void
 **/
const insertBefore = (newNode: HTMLElement, referenceNode: HTMLElement) => {
  referenceNode.insertBefore(newNode, referenceNode.firstChild);
};

/**
 * insertAfter
 * @description inserts an element after another element.
 * @param newNode
 * @param referenceNode
 * @returns void
 **/
const insertAfter = (newNode: HTMLElement, referenceNode: HTMLElement) => {
  if (referenceNode.lastChild === null) {
    referenceNode.appendChild(newNode);
    return;
  }
  referenceNode.insertBefore(newNode, referenceNode.lastChild.nextSibling);
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
