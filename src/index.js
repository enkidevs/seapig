import { Children } from 'react'
import invariant from 'invariant'

export const OPTIONAL = {
  min: 0
}

export const REQUIRED = {
  min: 1
}

const REST = 'rest'

/**
 *
 *  Utility to restrict the shape of a React component.
 *
 * @param {React.Children} children
 * @param {Object} schema Hash containing `seapig` schema options
 *
 * @example <caption>Example usage of 🌊🐷</caption>
 *
 * const {
 *  icon, //<-- array of icon elements
 *  rest  // <-- array of all other children
 * } = seapig(children, {
 *  icon: {
 *    min: 1,
 *    max: 1
 *  }
 * })
 *
 * @returns {Object} Object hash where each key is one of the given props whose
 * value is a react component matching that prop
 */
export default function seapig (children, schema = {}) {
  invariant(schema && typeof schema === 'object', 'schema must be an object')

  // extract schema and initialize the result
  const propNames = Object.keys(schema)
  const result = propNames.reduce(
    (obj, propName) => {
      obj[propName] = []
      return obj
    },
    {
      [REST]: []
    }
  )

  // build the result
  Children.forEach(children, child => {
    if (!child) {
      return
    }
    const propName = propNames.find(p => child.props[p]) || REST
    result[propName].push(child)
  })

  // validate the result
  propNames.forEach(propName => {
    assertSchemaProp('min', propName, result, schema)
    assertSchemaProp('max', propName, result, schema)
  })

  return result
}

const defaultSchema = {
  min: 0,
  max: Infinity
}

function isValidNum (num) {
  return typeof num === 'number' && !isNaN(num)
}

const validations = {
  min: (count, min) => count >= min,
  max: (count, max) => count <= max
}

function assertSchemaProp (numProp, schemaProp, result, schema) {
  const elementsCount = result[schemaProp].length
  const propSchema = schema[schemaProp]
  const limit = isValidNum(propSchema[numProp])
    ? propSchema[numProp]
    : defaultSchema[numProp]
  invariant(
    validations[numProp](elementsCount, limit),
    numProp === 'min'
      ? `Must have at least ${limit} \`${schemaProp}\` elements`
      : `Cannot have more than ${limit} \`${schemaProp}\` elements`
  )
}
