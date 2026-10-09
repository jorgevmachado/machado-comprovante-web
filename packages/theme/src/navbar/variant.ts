export const ONavbarVariant = ['dark', 'light'] as const;

export type TNavbarVariant = (typeof ONavbarVariant)[number];