import express from 'express';
import { can } from './middleware/can.middleware';
import {
  addRoleMembers,
  getUsersEligibleForRole,
  removeRoleMember,
} from './roles.controller';

export const roleMembersRouter = express.Router({
  mergeParams: true,
});

roleMembersRouter
  .post('/', can('update', 'Role'), addRoleMembers)
  .delete('/:userId', can('update', 'Role'), removeRoleMember)
  .get('/eligible', can('read', 'Role'), getUsersEligibleForRole);
