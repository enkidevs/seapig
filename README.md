# seapig 🌊🐷

![Sea Pig](https://media.giphy.com/media/X2C5xcQLdVGda/giphy.gif)

> Utility to restrict the shape of a [React](http://facebook.github.io/react/index.html) component.

## `seapig`. `seapig`. Does whatever a `seapig` does!

Your friendly neighborhood `seapig` is here to help you maintain consistent rendering structure for your React Components.

Good ol' `seapig` restricts this consistent shape by enforcing [**Rendering Order**](#RenderingOrder) and [**Child Presence**](#ChildPresence) using a schema object.

The main purpose is to promote a cleaner rendering structure by requiring components that can (or must) be rendered together to be provided externally as children rather than passing them as props:

```js
/* No more need for this */
<Button label={<span>Click Me</span>} icon={<i className="fa" />} />

/* Now we can have this */
<Button>
  <i className="fa" icon />
  <span>Click Me</span>
</Button>
```

This allows a cleaner JSX layout by decoupling how children are rendered together from how they are defined.

### <a name="RenderingOrder">Rendering Order</a>

Components that use `seapig` render their children into special placeholders determined by schema. This means that the rendering shape is enforced internally, allowing us to pass the children into a `seapig` component in any order.

```js
/* `MyCoolSidebar` and `Content` are always rendered in the same order no matter what order they are passed in */

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

/* Corresponding seapig component example */
import seapig, { OPTIONAL, REQUIRED } from 'seapig'

const Main = props => {
  const {
    sidebar, // <-- array of elements with the `sidebar` prop
    content  // <-- array of elements with the `content` prop
  } = seapig(props.children, { // <-- schema object
    sidebar: OPTIONAL, // <-- sidebar is optional
    content: REQUIRED  // <-- content is required
  })

  // rendering order is always the same
  return (
    <div>
      {sidebar && <aside>{sidebar}</aside>}
      <section>{content}</section>
    </div>
  )
}
```

### <a name="ChildPresence">Child presence</a>

A `seapig` component ensures that all children match the provided schema.

To reuse `<Main>` from above as an example, if we didn't pass any children with the `'content'` prop, `seapig` would throw:

```js
// The code bellow would throw a "Must have at least 1 `content` element" error
<Main>
  <MyCoolSidebar sidebar />
</Main>
```

The `seapig` also accumulates any unidentified children into the `rest` property.

```js
import seapig, { OPTIONAL, REQUIRED } from 'seapig'

const Main = props => {
  const {
    sidebar,
    content,
    rest, // <-- all children not matching `sidebar` and `content` are in this array
  } = seapig(props.children, {
    sidebar: OPTIONAL,
    content: REQUIRED
  })

  return (
    <div>
      {sidebar && <aside>{sidebar}</aside>}
      <section>{content}</section>
      {rest}
    </div>
  )
}

/* `rest` would contain the bottom section */
<Main>
  <Content content>
    <h2>Hello `seapig`!</h2>
  </Content>
  <MyCoolSidebar sidebar />
  <section>I would be in the `rest` array</section>
</Main>
```

In fact, `OPTIONAL` and `REQUIRED` are just helpful schema constants:

```js
const OPTIONAL = {
  min: 0
}
const REQUIRED = {
  min: 1
}
```

`seapig` allows us to pass custom `min` and `max`, both inclusive, values as well:

```js
import seapig from 'seapig'

const Main = props => {
  const {
    button
  } = seapig(props.children, {
    button: { // <-- custom button schema values
      min: 2,
      max: 5
    }
  })

  return (
    <div>
      <h1>I can have between 2 to 5 buttons</h1>
      {button}
    </div>
  )
}

/* Now we must have between 2 and 5 buttons */
<Main>
  <Button button>First</Button>
  <a button>Second</a>
  <div button>Third</div>
</Main>
```

## Why `seapig`?

Sea pig stands for (**C**hildren **P**rops **I**nternal **G**etter), except the `C` is spelled phonetically.

## Install

```bash
npm install seapig --save
```

## Example

### `seapig` button with a required label and an optional icon:

```js
import React, { Component } from 'react'
import seapig, { OPTIONAL, REQUIRED } from 'seapig'

/* Button with a required label and an optional icon */
class Button extends Component {
  render() {
    const {
      icon,
      label
    } = seapig(this.props.children, {
      icon: OPTIONAL,
      label: REQUIRED
    })

    return (
      <button>
        {icon && <span className="pull-left">{icon}</span>}
        {label}
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
      <form>
        {/* other form components */}
        <Button>
          <i className="fa fa-upload" icon />
          <span label>Submit</span>
        </Button>
      </form>
    )
  }
}
```

## API

```js
const {
  icon,
  label,
  image,
  rest, // array of children not matching any of the schema props
} = seapig(children, {
  icon: OPTIONAL, // use OPTIONAL to specify an optional child prop
  label: REQUIRED, // use REQUIRED to specify a required child prop,
  image: { // pass an object with `min` and/or `max`
    min: 1, // default is `0` if only `max` is specified
    max: 2  // default is `Infinity` if only `min` is specified
  }
})
```

## License

MIT
