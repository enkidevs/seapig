/* globals describe test expect */
import React from 'react';
import seapig, { DEFAULT_CHILD } from '../src/index';

// test data
const PROP = 'whatever';
const child = <div whatever />;
const defaultChild = <div />;
const children = [child, defaultChild];
const childrenWithSameProps = [child, child];
const multipleDefaultChildren = [defaultChild, defaultChild];
const defaultChildArray = [defaultChild];

// error messages
const ERROR_MSG_MISSING_CHILD = `Missing required prop \`${PROP}\``;
const ERROR_MSG_MISSING_DEFAULT_CHILD = 'Missing a prop-less child';
const ERROR_MSG_REPEATING_CHILD = `There can only be 1 child with \`${PROP}\` prop.`;
const ERROR_MSG_REPEATING_DEFAULT_CHILD =
  'There can only be 1 child without any of the specified props';
const ERROR_MSG_INVALID_OPTIONS =
  '`optional` and `required` props must be an array';

/*
 Note: must use `React.Children.toArray` when comparing instances.
 The reason is that `seapig` uses `React.Children.toArray` under the
 hood which adds a key to each element in the array it returns.
 This means must do the same to make sure keys are equal when comparing.
*/
const childrenReact = React.Children.toArray(children);
const defaultChildArrayReact = React.Children.toArray(defaultChildArray);

describe('seapig', () => {
  // optional child
  test('should return optional child that exists', () => {
    expect(
      seapig(children, {
        optional: [PROP],
      })
    ).toEqual({ [PROP]: childrenReact[0] });
  });
  test('should not return optional child that does not exists', () => {
    expect(
      seapig([], {
        optional: [PROP],
      })
    ).toEqual({});
  });
  test('should throw for multiple optional children with same prop', () => {
    expect(() => {
      seapig(childrenWithSameProps, {
        optional: [PROP],
      });
    }).toThrow(ERROR_MSG_REPEATING_CHILD);
  });

  // optional default child (without an existing prop)
  test('should return optional default child that exists', () => {
    expect(
      seapig(defaultChildArray, {
        optional: [DEFAULT_CHILD],
      })
    ).toEqual({ [DEFAULT_CHILD]: defaultChildArrayReact[0] });
  });
  test('should not return optional default child that does not exists', () => {
    expect(
      seapig([], {
        optional: [DEFAULT_CHILD],
      })
    ).toEqual({});
  });
  test('should throw for multiple default children', () => {
    expect(() => {
      seapig(multipleDefaultChildren, {
        optional: [DEFAULT_CHILD],
      });
    }).toThrow(ERROR_MSG_REPEATING_DEFAULT_CHILD);
  });

  // required child
  test('should return required child that exists', () => {
    expect(
      seapig(children, {
        required: [PROP],
      })
    ).toEqual({ [PROP]: childrenReact[0] });
  });
  test('should throw for required child that does not exists', () => {
    expect(() => {
      seapig([], {
        required: [PROP],
      });
    }).toThrow(ERROR_MSG_MISSING_CHILD);
  });
  test('should throw for multiple required children with same prop', () => {
    expect(() => {
      seapig(childrenWithSameProps, {
        required: [PROP],
      });
    }).toThrow(ERROR_MSG_REPEATING_CHILD);
  });

  // required default child (without existing prop)
  test('should return required default child that exists', () => {
    expect(
      seapig(defaultChildArray, {
        required: [DEFAULT_CHILD],
      })
    ).toEqual({ [DEFAULT_CHILD]: defaultChildArrayReact[0] });
  });
  test('should throw for required default child that does not exists', () => {
    expect(() => {
      seapig([], {
        required: [DEFAULT_CHILD],
      });
    }).toThrow(ERROR_MSG_MISSING_DEFAULT_CHILD);
  });
  test('should throw for multiple require default children', () => {
    expect(() => {
      seapig(multipleDefaultChildren, {
        optional: [DEFAULT_CHILD],
      });
    }).toThrow(ERROR_MSG_REPEATING_DEFAULT_CHILD);
  });

  // invalid inputs
  test('should return empty object for no inputs', () => {
    expect(seapig()).toEqual({});
    expect(seapig(children)).toEqual({});
  });
  test('should throw for non-array options props', () => {
    expect(() => {
      seapig(children, {
        optional: null,
      });
    }).toThrow(ERROR_MSG_INVALID_OPTIONS);
    expect(() => {
      seapig(children, {
        required: null,
      });
    }).toThrow(ERROR_MSG_INVALID_OPTIONS);
  });
});
