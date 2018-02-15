/* globals describe test expect */
import React, { Children } from 'react'
import seapig, { OPTIONAL, OPTIONALS, REQUIRED, REQUIREDS } from '../src/index'

// test data
const PROP = 'whatever'
const SEAPIG_PROP = `${PROP}Children`
const a = <div whatever />
const b = <div whatever />
const c = <div />
const d = <div />
const children = [a, b, c, d]
const childrenWithProp = [a, b]
const childrenWithoutProp = [c, d]
const childrenReact = Children.toArray(children)
const childrenWithSingleChildWithProp = children.slice(1)
const childrenWithSingleChildWithPropReact = Children.toArray(
  childrenWithSingleChildWithProp
)

// error messages
const ERROR_MSG_ENDING_REGEX = `\\d \`${PROP}\` element(?:s|$)?`
const ERROR_MSG_INVARIANT_MIN = new RegExp(
  `Must have at least ${ERROR_MSG_ENDING_REGEX}`
)
const ERROR_MSG_INVARIANT_MAX = new RegExp(
  `Cannot have more than ${ERROR_MSG_ENDING_REGEX}`
)

describe('seapig', () => {
  describe(`should return array of children matching \`${PROP}\` and an array of the remaining children under \`rest\``, () => {
    test('for OPTIONAL', () => {
      expect(
        seapig(childrenWithSingleChildWithProp, {
          [PROP]: OPTIONAL
        })
      ).toEqual({
        [SEAPIG_PROP]: [childrenWithSingleChildWithPropReact[0]],
        rest: childrenWithSingleChildWithPropReact.slice(1)
      })
    })
    test('for OPTIONALS', () => {
      expect(
        seapig(children, {
          [PROP]: OPTIONALS
        })
      ).toEqual({
        [SEAPIG_PROP]: childrenReact.slice(0, 2),
        rest: childrenReact.slice(2)
      })
    })
    test('for REQUIRED', () => {
      expect(
        seapig(childrenWithSingleChildWithProp, {
          [PROP]: REQUIRED
        })
      ).toEqual({
        [SEAPIG_PROP]: [childrenWithSingleChildWithPropReact[0]],
        rest: childrenWithSingleChildWithPropReact.slice(1)
      })
    })
    test('for REQUIREDS', () => {
      expect(
        seapig(children, {
          [PROP]: REQUIREDS
        })
      ).toEqual({
        [SEAPIG_PROP]: childrenReact.slice(0, 2),
        rest: childrenReact.slice(2)
      })
    })
  })

  // min and max invariants
  test(`should throw for violated min invariant`, () => {
    expect(() => {
      seapig(childrenWithoutProp, {
        [PROP]: REQUIRED
      })
    }).toThrow(ERROR_MSG_INVARIANT_MIN)
  })
  test(`should throw for violated max invariant`, () => {
    expect(() => {
      seapig(childrenWithProp, {
        [PROP]: {
          max: 1
        }
      })
    }).toThrow(ERROR_MSG_INVARIANT_MAX)
  })

  // invalid inputs
  test('should return empty object for no inputs', () => {
    expect(seapig()).toEqual({
      rest: []
    })
  })
  test('should return all children as `rest` object for no schema', () => {
    expect(seapig(children)).toEqual({
      rest: childrenReact
    })
  })
  test('should return empty array under `rest` for invalid children', () => {
    expect(seapig(null)).toEqual({
      rest: []
    })
  })
  test('should throw for invalid schema', () => {
    expect(() => {
      seapig(children, null)
    }).toThrow('schema must be an object')
  })
  test(`should throw when an element has multiple matching props`, () => {
    const invalidChildren = [<div whatever other />]
    expect(() => {
      seapig(invalidChildren, {
        [PROP]: OPTIONAL,
        other: OPTIONAL
      })
    }).toThrow('expected at most 1 seapig prop per element but found 2 (whatever, other) for child at index 0');
  })
})
