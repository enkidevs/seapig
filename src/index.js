// @flow

import type { Node, Element } from 'react'
import { Children } from 'react'
import invariant from 'invariant'


type SchemaProp = 'min' | 'max'

type Schema = {
  [SchemaProp]: number
}

type SeaPigResult =  {
  [string]: Array<Element<any>>
}

export const OPTIONAL: Schema = {
  min: 0,
  max: 1
}

export const OPTIONALS: Schema = {
  min: 0
}

export const REQUIRED: Schema = {
  min: 1,
  max: 1
}

export const REQUIREDS : Schema = {
  min: 1
}

const REST: string = 'rest'

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
 * @returns {Object} Object hash where each key is one of the given props concatenated with 'Children' and each value is a react component matching that prop.
 */

export default function seapig (children: Node, schema: Schema = {}) : SeaPigResult {
  invariant(schema && typeof schema === 'object', 'schema must be an object')

  // extract schema and initialize the result
  const propNames: Array<string> = Object.keys(schema)
  const result: SeaPigResult = propNames.reduce(
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
    const propName: string = propNames.find(p => child.props[p]) || REST
    result[propName === REST ? propName : convertPropName(propName)].push(child)
  })

  // validate the result
  propNames.forEach(propName => {
    assertSchemaProp('min', propName, result, schema)
    assertSchemaProp('max', propName, result, schema)
  })

  return result
}

function convertPropName (propName: string) : string {
  return `${propName}Children`
}

const defaultSchema: Schema = {
  min: 0,
  max: Infinity
}


function isValidNum (num: ?number) : boolean {
  return typeof num === 'number' && !isNaN(num)
}

type ValidationFunction = (number, number) => boolean;

type ValidationFunctions = {
  [SchemaProp]: ValidationFunction
}
const validations: ValidationFunctions = {
  min: (count: number, min: number): boolean => count >= min,
  max: (count: number, max: number): boolean => count <= max
}

function assertSchemaProp (schemaProp: SchemaProp, prop: string,  result: SeaPigResult, schema: Schema) {
  const elementsCount: number = result[convertPropName(prop)].length
  const propSchema: Schema = schema[prop]
  const limit: number = isValidNum(propSchema[schemaProp])
    ? propSchema[schemaProp]
    : defaultSchema[schemaProp]
  const invariantMessageEnding: string = `${limit} \`${prop}\` element${limit !== 1 ? 's' : ''}`
  invariant(
    validations[schemaProp](elementsCount, limit),
    schemaProp === 'min'
      ? `Must have at least ${invariantMessageEnding}`
      : `Cannot have more than ${invariantMessageEnding}`
  )
}
