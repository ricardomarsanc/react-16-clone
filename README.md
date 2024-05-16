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
