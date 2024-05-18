function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  }
}

/**
 * Creates an HTML element from a fiber and returns it.
 *
 * @example
 * ```js
 * const fiber = {
 *   dom: document.createElement("div"), // root element
 *   parent: null, // no parent, the fiber is the root fiber
 *   children: [
 *     {
 *       type: "TEXT_ELEMENT",
 *       props: {
 *         nodeValue: "foo",
 *         children: [],
 *       },
 *     }
 *   ]
 * }
 *
 * const dom = createDom(fiber)
 *
 * console.log(dom)
 * // Expected output: HTML element <div>foo</div>
 * ```
 */
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)

  const isProperty = (key) => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name]
    })

  return dom
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}

let nextUnitOfWork = null

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

/**
 * Function that creates the DOM elements for a given fiber, creates the fibers for its children,
 * and selects the next unit of work, following this steps:
 *
 * 1. add the element to the DOM
 * 2. create the fibers for the element's children
 * 3. select the next unit of work
 *
 * @returns The next unit of work (fiber) to be performed.
 */
function performUnitOfWork(fiber) {
  // 1. add the element to the DOM
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  // 2. create the fibers for the element's children
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  while (index < elements.length) {
    const element = elements[index]

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }

  // 3. select the next unit of work
  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

const RReact = {
  createElement,
  render,
}

// RReact App

/** @jsx RReact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
const container = document.getElementById("root")
RReact.render(element, container)
