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

console.warn(
  "Veldt is alpha-alpha-alpha experimental software. This is not made for serious software yet. Use at your own risk."
);

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
 * @returns Element | Text Node
 */
const createElement = (
  type: string | Function | Element | Text | DocumentFragment | Element | null,
  props: Record<string, any>,
  ...children: any[]
): Element | any => {
  if (!props || !props?.children) {
    if (!props) props = {};
    props["children"] = children;
  }
  if (typeof type === "function" || type instanceof Function) {
    if (props && props?.ref) {
      props.ref.current = type(props, children);
      return props.ref.current;
    }
    return type(props, children);
  }
  if (type === null) {
    return null;
  }
  if (
    type instanceof HTMLElement ||
    type instanceof Text ||
    type instanceof DocumentFragment ||
    type instanceof Element
  ) {
    return type;
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
      if (key === "dangerouslySetInnerHTML") {
        element.innerHTML = props[key].__html;
        return;
      }
      element.setAttribute(key, props[key]);
    });

  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      if (
        child instanceof Element ||
        child instanceof Text ||
        child instanceof DocumentFragment ||
        child instanceof Element
      ) {
        element.appendChild(child);
        return;
      } else if (child instanceof Array) {
        child.forEach((c) => {
          if (typeof c === "string") {
            element.appendChild(document.createTextNode(c));
          } else if (
            c instanceof Element ||
            c instanceof Text ||
            c instanceof DocumentFragment ||
            c instanceof Element
          ) {
            element.appendChild(c);
          } else {
            element.appendChild(document.createTextNode(c));
          }
        });
      }
      if (child === null) {
        return;
      }
      if (child instanceof Function) {
        element.appendChild(child());
        return;
      }
      if (typeof child === "string" || typeof child === "number") {
        element.appendChild(document.createTextNode(child.toString()));
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
  if (props && props?.ref) {
    props.ref.current = fragment;
  }
  if (typeof children === "string") {
    fragment.appendChild(document.createTextNode(children));
    return fragment;
  }
  if (children.length === 0) return fragment;
  children.forEach((child) => {
    if (typeof child === "string") {
      fragment.appendChild(document.createTextNode(child));
    } else if (
      child instanceof Element ||
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
          c instanceof Element ||
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
      if (child === null) {
        return;
      }
      if (child instanceof Function) {
        fragment.appendChild(child());
        return;
      }
      if (typeof child === "string") {
        fragment.appendChild(document.createTextNode(child));
      }
    }
  });
  return fragment;
};

/**
 * render
 * @description renders an element to a container. If the element is null, it will remove the first child of the container. Also runs all side effects after rendering.
 * @param element Element | Text Node | null
 * @param container Element
 */
const render = (element: Element, container: Element) => {
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
  while (effects.length > 0) effects.pop()?.callback();
};

/**
 * replaceRender
 * @description replaces an element with another element.
 * @param element
 * @param container
 * @returns void
 **/
const replaceRender = (element: Element, container: Element) => {
  container.parentElement?.replaceChild(element, container);
  while (effects.length > 0) effects.pop()?.callback();
};

/**
 * insertBefore
 * @description inserts an element before another element.
 * @param newNode
 * @param referenceNode
 * @returns void
 **/
const insertBefore = (newNode: Element, referenceNode: Element) => {
  referenceNode.parentElement?.insertBefore(newNode, referenceNode);
  while (effects.length > 0) effects.pop()?.callback();
};

/**
 * insertAfter
 * @description inserts an element after another element.
 * @param newNode
 * @param referenceNode
 * @returns void
 **/
const insertAfter = (newNode: Element, referenceNode: Element) => {
  referenceNode.parentElement?.insertBefore(newNode, referenceNode.nextSibling);
  while (effects.length > 0) effects.pop()?.callback();
};

/**
 * insertChildBefore
 * @description inserts an element into an element, inserts before existing children.
 * @param newNode
 * @param referenceNode
 * @returns void
 **/
const insertChildBefore = (newNode: Element, referenceNode: Element) => {
  if (referenceNode.firstChild === null) {
    referenceNode.appendChild(newNode);
    return;
  }
  referenceNode.insertBefore(newNode, referenceNode.firstChild);

  while (effects.length > 0) effects.pop()?.callback();
};

/**
 * insertChildAfter
 * @description inserts an element after another element.
 * @param newNode
 * @param referenceNode
 * @returns void
 **/
const insertChildAfter = (newNode: Element, referenceNode: Element) => {
  if (referenceNode.lastChild === null) {
    referenceNode.appendChild(newNode);
    return;
  }
  referenceNode.insertBefore(newNode, referenceNode.lastChild.nextSibling);

  while (effects.length > 0) effects.pop()?.callback();
};

/**
 * remove
 * @description removes an element from the DOM.
 * @param element
 * @returns void
 **/
const remove = (element: Element) => {
  element.parentElement?.removeChild(element);
};

/**
 * renderToString
 * @description renders an element to a string.
 * @param element Element | Text Node
 * @returns string
 */
const renderToString = (element: Element) => {
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
  if (typeof crypto !== "undefined") {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  }
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
  replaceRender,
  renderToString,
  insertBefore,
  insertAfter,
  insertChildBefore,
  insertChildAfter,
  remove,
  effect,
  uuid,
  ref,
};

export default veldt;
