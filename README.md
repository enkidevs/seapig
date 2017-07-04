# seapig 🌊🐷

![Sea Pig](https://media.giphy.com/media/X2C5xcQLdVGda/giphy.gif)

> Utility to restrict the shape of a [React](http://facebook.github.io/react/index.html) component.

## `seapig`. `seapig`. Does whatever a `seapig` does!

Your friendly neighborhood `seapig` is here to help you maintain consistent rendering structure for your React Components. It retrieves designated props from children, ensures all corresponding children are provided, then renders them in a pre-determined order.

Good ol' `seapig` restricts this consistent shape by enforcing [**Rendering Order**](#RenderingOrder) and [**Child Presence**](#ChildPresence):

### <a name="RenderingOrder">Rendering Order</a>

Children are rendered into special placeholders determined by the provided props. This means that the rendering shape is enforced internally, allowing us to pass the children in any order from the outside.

```jsx
/* `MyCoolSidebar` and `Content` are always rendered in the same order no matter the order they are passed in */

/* This one would render the same */
<Main>
  <MyCoolSidebar sidebar />
  <Content content>
    <h2>Hello `seapig`!</h2>
  </Content>
</Main>

/* as this one */
<Main>
  <Content content>
    <h2>Hello `seapig`!</h2>
  </Content>
  <MyCoolSidebar sidebar />
</Main>

/* Corresponding seapig component */
import seapig, { DEFAULT_CHILD } from 'seapig'

const Main = props => {
  const {
    sidebar,
    content
  } = seapig(props.children, {
    required: ['sidebar', 'content']
  })

  // rendering order is always the same
  return (
    <div>
      <aside>{sidebar}</aside>
      <section>{content}</section>
    </div>
  )
}
```

### <a name="ChildPresence">Child presence</a>

A `seapig` component ensures that all children identified by the required props are passed in.

If we use `<Main>` from above without identifying it's children as the required `'content'` and `'sidebar'` component, `seapig` would throw:

```jsx
// The code bellow would throw a "Missing required prop `sidebar`" error
<Main>
  <Content content>
    <h2>Hello `seapig`!</h2>
  </Content>
</Main>
```

The `seapig` als ensures that there are no rogue un-identified children, unless we tell it explicitly that we are expecting a single child without an identifying prop.

```jsx
import seapig, { DEFAULT_CHILD } from 'seapig'

const Main = props => {
  const {
    sidebar,
    content,
    [DEFAULT_CHILD]: thirdChild
  } = seapig(props.children, {
    optional: DEFAULT_CHILD // <-- tell seapig we're expacting an undentified child
    required: ['sidebar', 'content']
  })

  // rendering order is always the same
  return (
    <div>
      <aside>{sidebar}</aside>
      <section>{content}</section>
      <section>thirdChild</section>
    </div>
  )
}

/* Allowing us to not need to specify an identifying prop on one of the children */
<Main>
  <Content content>
    <h2>Hello `seapig`!</h2>
  </Content>
  <MyCoolSidebar sidebar />
  <IAmTheThirdChildWithoutIdentifyingProp />
</Main>
```

## Why `seapig`?

Sea pig stands for (**C**hildren **P**rops **I**nternal **G**etter), except the `C` is spelled phonetically.

## Install

```bash
npm install seapig --save
```

## Example

1. `seapig` button with a require label and an optional icon

```jsx
import React, { Component } from 'react'
import cpig from 'seapig'

/* Button with a required label and an optional icon */
class Button extends Component {
  render() {
    const {
      icon,
      label,
      [DEFAULT_CHILD]: rightSection
    } = cpig(this.props.children, {
      optional: ['icon'],
      required: ['label']
    })

    return (
      <button>
        {icon && <span className="pull-left">{icon}</span>}
        {label}
        {rightSection && <section clasName="pull-right">{rightSection}</section>}
      </button>
    )
  }
}

/* usage of the seapig Button */
import React, { Component } from 'react'
import Button from './Button'

class Form extends Component {
  render() {
    return (
      <div>
        <Button>
          <i className="fa fa-cog"></i>
          <span label>Click Me</span>
          <a href="https://enki.com">Unidentified Link</a>
        </Button>
      </div>
    )
  }
}
```

## API

```js
const {
  icon,
  [DEFAULT_CHILD]: proplessChild, // the single allowed child without any props to get
  label,
} = seapig(children, {
  // optional children prop names are denoted in the `optional` array
  optional: ['icon', DEFAULT_CHILD],
  // required children prop names are denoted in the `required` array
  required: ['label'] // code will throw if no label was passed
})
```

## License

MIT
