declare module 'seapig' {
  import { ReactNode } from 'react';

  interface ValidationConfiguration {
    min?: number;
    max?: number;
  }

  interface Schema {
    [key: string]: ValidationConfiguration;
  }

  interface Result {
    [key: string]: ReactNode;
    rest: ReactNode;
  }

  export default function seapig(
    children?: ReactNode | null,
    schema?: Schema,
  ): Result;

  export const OPTIONAL: ValidationConfiguration;

  export const OPTIONALS: ValidationConfiguration;

  export const REQUIRED: ValidationConfiguration;

  export const REQUIREDS: ValidationConfiguration;
}
