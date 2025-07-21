/**
 * Type definitions for the 'another-json' module
 *
 * This file is necessary because:
 * - The 'another-json' package used by matrix-js-sdk doesn't have built-in TypeScript types
 * - Without these types, TypeScript throws TS7016 errors about implicit 'any' types
 * - This resolved type errors for the JSON parsing functionality used by the SDK
 */

declare module 'another-json' {
  const anotherjson: {
    parse(jsonString: string): unknown;
    stringify(value: unknown): string;
  };
  export default anotherjson;
}
