// @flow

import type { Node, Element } from "react";
import { Children } from "react";
import invariant from "invariant";

type ValidationProp = "min" | "max";

type ValidationFunctions = { [ValidationProp]: (number, number) => boolean };

type ValidationSchema = {
  [ValidationProp]: number
};

type SeaPigSchema = {
  [string]: ValidationSchema
};

type SeaPigResult = {
  [string]: Array<Element<any>>
};

export const OPTIONAL: ValidationSchema = {
  min: 0,
  max: 1
};

export const OPTIONALS: ValidationSchema = {
  min: 0
};

export const REQUIRED: ValidationSchema = {
  min: 1,
  max: 1
};

export const REQUIREDS: ValidationSchema = {
  min: 1
};

const REST: string = "rest";
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

export default function seapig(children: Node, schema: SeaPigSchema = {}): SeaPigResult {
  invariant(schema && typeof schema === "object", "schema must be an object");

  // extract schema and initialize the result
  const propNames: Array<string> = Object.keys(schema);
  const result: SeaPigResult = propNames.reduce(
    (r, propName) => {
      r[convertPropName(propName)] = [];
      return r;
    },
    {
      [REST]: []
    }
  );

  // build the result
  Children.toArray(children).forEach(child => {
    if (!child) {
      return;
    }
    const propName: string = propNames.find(p => child.props[p]) || REST;
    result[propName === REST ? propName : convertPropName(propName)].push(child);
  });

  // validate the result
  propNames.forEach(propName => {
    assertSchemaProp("min", propName, result, schema);
    assertSchemaProp("max", propName, result, schema);
  });

  return result;
}

function convertPropName(propName: string): string {
  return `${propName}Children`;
}

const defaultValidationSchema: ValidationSchema = {
  min: 0,
  max: Infinity
};

function isValidNum(num: ?number): boolean {
  return typeof num === "number" && !isNaN(num);
}

const validations: ValidationFunctions = {
  min: (count: number, min: number): boolean => count >= min,
  max: (count: number, max: number): boolean => count <= max
};

function assertSchemaProp(
  validationProp: ValidationProp,
  schemaProp: string,
  result: SeaPigResult,
  schema: SeaPigSchema
) {
  const elementsCount: number = result[convertPropName(schemaProp)].length;
  const validationSchema: ValidationSchema = schema[schemaProp];
  const limit: number = isValidNum(validationSchema[validationProp])
    ? validationSchema[validationProp]
    : defaultValidationSchema[validationProp];
  const invariantMessageEnding: string = `${limit} \`${schemaProp}\` element${limit !== 1 ? "s" : ""}`;
  invariant(
    validations[validationProp](elementsCount, limit),
    validationProp === "min"
      ? `Must have at least ${invariantMessageEnding}`
      : `Cannot have more than ${invariantMessageEnding}`
  );
}
