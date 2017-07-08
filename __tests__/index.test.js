/* globals describe test expect */
import React from 'react'
import seapig, { OPTIONAL, REQUIRED } from '../src/index'

// test data
const PROP = 'whatever'
const a = <div whatever />
const b = <div whatever />
const c = <div />
const d = <div />
const children = [a, b, c, d]
const childrenWithProp = [a, b]
const childrenWithoutProp = [c, d]

// error messages
const ERROR_MSG_ENDING_REGEX = `\\d \`${PROP}\` element(?:s|$)?`
const ERROR_MSG_INVARIANT_MIN = new RegExp(
  `Must have at least ${ERROR_MSG_ENDING_REGEX}`
)
const ERROR_MSG_INVARIANT_MAX = new RegExp(
  `Cannot have more than ${ERROR_MSG_ENDING_REGEX}`
)

describe('seapig', () => {
  test(`should return array of children matching \`${PROP}\` and an array of the remaining children under \`rest\``, () => {
    // OPTIONAL
    expect(
      seapig(children, {
        [PROP]: OPTIONAL
      })
    ).toEqual({
      [PROP]: childrenWithProp,
      rest: childrenWithoutProp
    })
    // REQUIRED
    expect(
      seapig(children, {
        [PROP]: REQUIRED
      })
    ).toEqual({
      [PROP]: childrenWithProp,
      rest: childrenWithoutProp
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
      rest: children
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
})
