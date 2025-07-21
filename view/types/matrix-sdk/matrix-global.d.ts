/**
 * Global type definitions for missing browser APIs
 *
 * This file is necessary because:
 * - matrix-js-sdk uses modern JavaScript features not yet in TypeScript's standard lib
 * - Legacy WebRTC APIs like Navigator.webkitGetUserMedia are not in standard types
 * - Without these definitions, TypeScript throws TS2304 and TS2339 errors
 * - This extends the global interfaces to match the runtime APIs the SDK depends on
 */

declare global {
  interface Uint8Array {
    toBase64?(options?: Uint8ArrayToBase64Options): string;
  }

  interface Uint8ArrayConstructor {
    fromBase64?(
      base64: string,
      options?: Uint8ArrayFromBase64Options,
    ): Uint8Array;
  }

  interface Uint8ArrayToBase64Options {
    alphabet?: 'base64' | 'base64url';
    omitPadding?: boolean;
  }

  interface Uint8ArrayFromBase64Options {
    alphabet?: 'base64' | 'base64url';
    lastChunkHandling?: 'loose' | 'strict';
  }

  interface Navigator {
    webkitGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: Error) => void,
    ) => void;
  }

  interface MediaTrackConstraints {
    mandatory?: {
      [key: string]: boolean | number | string;
    };
  }
}

export {};
