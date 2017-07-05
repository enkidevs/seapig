import React from 'react';
import invariant from 'invariant';

export const DEFAULT_CHILD = 'child';

/**
 *
 *  Utility to restrict the shape of a React component.
 *
 * @param {React.Children} children
 * @param {Object} propsToGet Hash containing `seapig` options
 *
 * @example <caption>Example usage of 🌊🐷</caption>
 * const {
 *  icon,
 *  [DEFAULT_CHILD]: proplessChild, // the single allowed child without any props to get
 *  label, // code will throw if no label was passed
 * } = seapig(children, {
 *  optional: ['icon', DEFAULT_CHILD],
 *  required: ['label']
 * })
 *
 * @returns {Object} Object hash where each key is one of the given props whose
 * value is a react component matching that prop
 */
export default function seapig(
  children,
  { optional = [], required = [] } = {}
) {
  invariant(
    Array.isArray(optional) && Array.isArray(required),
    '`optional` and `required` props must be an array'
  );
  if (optional.length === 0 && required.length === 0) {
    return {};
  }

  const foundProps = {};
  const defaultChildLabel =
    optional.includes(DEFAULT_CHILD) || required.includes(DEFAULT_CHILD)
      ? DEFAULT_CHILD
      : undefined;
  const result = React.Children.toArray(children).reduce((extracted, child) => {
    if (!child) {
      return extracted;
    }

    const prop =
      findOneOfThePropsOnTheChild(child, optional, required) ||
      defaultChildLabel;

    if (typeof prop !== 'undefined') {
      assertPropWasNotAlreadyFound(foundProps, prop);
      foundProps[prop] = true;
      extracted[prop] = child;
    }

    return extracted;
  }, {});

  assertRequiredPropsWereFound(foundProps, required);

  return result;
}

function findOneOfThePropsOnTheChild(child, optional, required) {
  const check = prop => child.props[prop];
  return optional.find(check) || required.find(check);
}

function assertPropWasNotAlreadyFound(foundProps, prop) {
  invariant(
    typeof foundProps[prop] === 'undefined',
    prop === DEFAULT_CHILD
      ? 'There can only be 1 child without any of the specified props'
      : `There can only be 1 child with \`${prop}\` prop.`
  );
}

function assertRequiredPropsWereFound(foundProps, required) {
  required.forEach(prop => {
    invariant(
      typeof foundProps[prop] !== 'undefined',
      prop === DEFAULT_CHILD
        ? 'Missing a prop-less child'
        : `Missing required prop \`${prop}\``
    );
  });
}
