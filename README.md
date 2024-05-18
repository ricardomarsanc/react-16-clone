# Building React 16 (16.8) from scratch

The purpose of this project is to gain a deeper understanding on how React works internally.

Features this bare bone React version includes, in order of development:

1. `createElement` function
2. `render` function
3. Concurrent Mode
4. Fibers (VDOM building tool)
5. Render and Commit phases
6. Reconciliation
7. Support for Function components
8. Support for hooks
9. This minified version of React DOES NOT support class components

Based on an article [published by Rodrigo Pombo back in 2019](https://pomb.us/build-your-own-react/).

## Development notes

### How is JSX transpiled to JS?

Given the following JSX code:

```jsx
const element = <h1 title="foo">Hello, world!</h1>
```

What is happening in the background is that **React** is calling its `createElement` function internally:

```js
const element = React.createElement(
  "h1", // HTML tag
  { title: "foo" }, // HTML Attributes
  "Hello" // Content / Children
)
```

The `createElement` function creates an **object** from its arguments, that would look like this:

```js
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
```

This is, in summary, what a React element is: **an object with two properties: `type` and `props`**.

> `children` in this case is a string, but usually it is an array with more React elements (objects with `type`, `props`, and `children` as well). So React elements have a tree structure, in which there's a root element with one or more elements anidated, and this goes on _ad-infinitum_.

### Creating a custom `createElement` function

The `createElement` function creates React elements from a set of properties that define HTML nodes. This elements are objects disposed in a tree structure that makes the VDOM easier to compose.

This function accepts a `type` (HTML tag), some `props` (HTML attributes and _custom **props**_), and an array of `children`, that will be returned inside the `props` object in the result element (or empty array if none have been passed).

It has to be taken into account that sometimes `children` are primitive values, so a helper function `createTextElement` was created to be called when a `children` is not of type `object`.

> In the real world, React doesn’t wrap primitive values or create empty arrays when there are no children, but in this case it was done like this to simplify the code.

### Creating a custom React-like API that Babel can use to transpile JSX

This custom clone of React is called RReact (quite original).

**But we still want to use JSX here**. How do we tell Babel to use RReact’s `createElement` instead of the original React’s function?

We can add a comment to our code to tell Babel to use our function instead of React's one when transpiling JSX:

```jsx
/** @jsx RReact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
```

> We don't need the same comment for the `render` function. This is because the `babel/preset-react` plugin included with `react-scripts` has some default rules for transforming JSX into JS, and one of them is the "Automatic runtime" feature, which uses `React` as the default API, in order to avoid the need of explicit imports (not needed from React v17). `render` function comes from `ReactDOM`, and there's no default runtime for that API, so we can safely use ours instead.

### It works! 🤖

At this point in the commit history, the first tiny version of the project should be working fine. In order to be sure the custom RReact API is being used behind the scenes, notice that **we didn't import React/ReactDOM into our `index.js`**. Also, checking the Sources inside the browser tools should show the transpiled code. It is possible to play with the `createElement` function to actually see those changes are being updated when running the code again 🧠.

> Notice that no `webpack` or `babel` config was added to the project, nor any related plugins. This is because the (now deprecated) `react-scripts` library has all those things built-in and pre-configured by default for running React apps with a minimal setup. There are alternatives to expose/customize the `webpack` and transpiler options, like **ejecting** or using a third-party library like `craco`. Nowadays most configurations are exposed OOB when building React apps with frameworks like `NextJS` or `Vite`.

## Troubleshooting

Notes for anyone who wants to run the project (most likely myself in several months, if so).

### Starting local dev environment for newer Node versions

The libraries used in this tiny project are way outdated _even at the moment of developing it_. If you get an error `Error: error:0308010C:digital envelope routines::unsupported` while running the start command (`npm start`), run this one instead:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```
