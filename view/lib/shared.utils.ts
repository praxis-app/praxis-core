import { clsx, type ClassValue } from 'clsx';
import { t as translate } from 'i18next';
import { Namespace, TFunction } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for conditionally combining and merging CSS class names.
 * Combines clsx for conditional classes with twMerge to resolve Tailwind CSS conflicts.
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * A wrapper around the i18next `t` function with type safety using the translation `Namespace` type.
 *
 * TODO: Remove this util and replace all instances with `useTranslation` hook
 * Ref: https://github.com/praxis-app/praxis-matrix-client/pull/7#pullrequestreview-3022541526
 */
export const t: TFunction<Namespace<'translation'>, undefined> = translate;

/** Generates a random string of a given length. */
export const getRandomString = (length: number) => {
  let result = '';
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
