import {
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
  RawRuleOf,
} from '@casl/ability';

export const ABILITY_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'manage',
] as const;

export const ABILITY_SUBJECTS = [
  'ServerConfig',
  'Channel',
  'Message',
  'Invite',
  'Role',
  'all',
] as const;

export type AbilityAction = (typeof ABILITY_ACTIONS)[number];
export type AbilitySubject = (typeof ABILITY_SUBJECTS)[number];

export type Abilities = [
  AbilityAction,
  AbilitySubject | ForcedSubject<Exclude<AbilitySubject, 'all'>>,
];

export type AppAbility = MongoAbility<Abilities>;

export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
  createMongoAbility<AppAbility>(rules);
