/** We need to replace this line for some code that JS can recognize */
// const element = <h1 title="foo">Hello</h1>
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}

/** This line is the same in JSX and JS */
const container = document.getElementById("root")

/** Same as with the first one, we need to replace this line for some code that JS can recognize */
// ReactDOM.render(element, container)
const node = document.createElement(element.type)
node["title"] = element.props.title

const textNode = document.createTextNode("")
textNode["nodeValue"] = element.props.children

node.appendChild(textNode)
container.appendChild(node)
