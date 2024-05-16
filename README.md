# Building React 16 (16.8) from scratch

The purpose of this project is to gain a deeper understanding on how React works internally.

Features this bare bone React version includes:

- `createElement` function
- `render` function
- Concurrent Mode
- Fibers (VDOM building tool)
- Render and Commit phases
- Reconciliation
- Support for Function components
- Support for hooks
- This minified version of React DOES NOT support class components

Based on an article [published by Rodrigo Pombo back in 2019](https://pomb.us/build-your-own-react/)

## Development notes

### From JSX to JS

We're so accustomed to JSX that we give certain things for granted. In order to understand React, we need to
understand first how JSX syntax works, and how it differs from JS. Given the following JSX code:

```jsx
const element = <h1 title="foo">Hello, world!</h1>
```

What is happening in the background is that React is calling its `createElement()` function internally:

```js
const element = React.createElement(
  "h1", // HTML tag
  { title: "foo" }, // HTML Attributes
  "Hello" // Content / Children
)
```

The `createElement()` function creates an object from its arguments, that would look similar to this one:

```js
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
```

This is, in summary, what a React element is, an object with two properties: `type` and `props`.

> `children` in this case is a string, but it’s usually an array with more elements. That’s why elements are also trees.

### Creating a custom `createElement` function

The `createElement` function creates React elements from a set of properties that define HTML nodes. This elements are objects disposed in a tree structure that makes the VDOM easier to compose.

The `createElement` function accepts a `type` (HTML tag), some `props` (HTML attributes and _custom props_), and an array of `children`, that will be returned inside the `props` object in the result element (or empty array if none have been passed).

We took into account that sometimes `children` are primitive values, so we created a helper `createTextElement` function that is called when a `children` is not of type `object`.

> React doesn’t wrap primitive values or create empty arrays when there aren’t children, but in this case we did it to simplify the code.

### Creating a custom React that Babel can treat as an API

Our custom React is called RReact (I know, very original).

**But we still want to use JSX here**. How do we tell Babel to use RReact’s `createElement` instead of React’s?

We can add a decorator to our code to tell Babel to use our function instead of React's one when transpiling JSX:

```jsx
/** @jsx RReact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
```

> We don't need the same decorator comment for the `render` function. This is because the `babel/preset-react` plugin included with `react-scripts` has some default rules for transforming JSX into JS, and one of them is the "Automatic runtime" feature, which uses `React` as the default API, in order to avoid explicit imports (not needed from React v17). `render` function comes from `ReactDOM`, and there's no default runtime for that function, so we can safely use ours instead.

### Starting local dev environment for newer Node versions

The libraries used in this tiny project are way outdated even at the moment of developing it. If you get an `Error: error:0308010C:digital envelope routines::unsupported` error while running the start command (`npm start`), run this one instead:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

You can know our custom RReact is being used behind the scenes because **we didn't import React/ReactDOM into our `index.js`**

> Notice that we didn't add any `webpack` or `babel` config, nor any related plugins. This is because the deprecated `react-scripts` library had everything built-in and pre-configured by default for running React apps with a minimal setup. There were alternatives to expose/customize the `webpack` and transpiler options, like **ejecting** or using a third-party library like `craco`. Nowadays most configurations are exposed OOB when building React apps with frameworks like `NextJS` or `Vite`.
