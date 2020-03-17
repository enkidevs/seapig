declare module 'seapig' {
  import { ReactElement } from 'react';

  interface ValidationConfiguration {
    min?: number;
    max?: number;
  }

  interface Schema {
    [key: string]: ValidationConfiguration;
  }

  interface Result {
    [key: string]: ReactElement[];
    rest: ReactElement[];
  }

  export default function seapig(
    children: ReactElement[],
    schema: Schema,
  ): Result;

  export const OPTIONAL: ValidationConfiguration;

  export const OPTIONALS: ValidationConfiguration;

  export const REQUIRED: ValidationConfiguration;

  export const REQUIREDS: ValidationConfiguration;
}
