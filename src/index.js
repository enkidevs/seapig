// @flow

import { Children } from 'react'
import invariant from 'invariant'

export const OPTIONAL = {
  min: 0,
  max: 1
}

export const OPTIONALS = {
  min: 0
}

export const REQUIRED = {
  min: 1,
  max: 1
}

export const REQUIREDS = {
  min: 1
}

const REST = 'rest'

/**
 *
 *  Utility for generalized composition of React components.
 *
 * @param {React.Children} children
 * @param {Object} schema Hash containing `seapig` schema options
 *
 * @example <caption>Example usage of 🌊🐷</caption>
 *
 * const {
 *  iconChildren, //array of icon elements
 *  rest          // array of all other children
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
    (r, propName) => {
      r[convertPropName(propName)] = []
      return r
    },
    {
      [REST]: []
    }
  )

  // build the result
  Children.toArray(children).forEach(child => {
    if (!child) {
      return
    }
    const propName = propNames.find(p => child.props[p]) || REST
    result[propName === REST ? propName : convertPropName(propName)].push(child)
  })

  // validate the result
  propNames.forEach(propName => {
    assertSchemaProp('min', propName, result, schema)
    assertSchemaProp('max', propName, result, schema)
  })

  return result
}

function convertPropName (propName) {
  return `${propName}Children`
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
  const elementsCount = result[convertPropName(schemaProp)].length
  const propSchema = schema[schemaProp]
  const limit = isValidNum(propSchema[numProp])
    ? propSchema[numProp]
    : defaultSchema[numProp]
  const invariantMessageEnding = `${limit} \`${schemaProp}\` element${limit !== 1 ? 's' : ''}`
  invariant(
    validations[numProp](elementsCount, limit),
    numProp === 'min'
      ? `Must have at least ${invariantMessageEnding}`
      : `Cannot have more than ${invariantMessageEnding}`
  )
}
