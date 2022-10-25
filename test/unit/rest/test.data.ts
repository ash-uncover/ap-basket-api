import mongoose from "mongoose";
import { createAccountModel, createMemberModel, createParticipantModel, createSectionModel, createSessionModel, createUserModel } from "../../../src/database/schemas";

export const ACCOUNT_1 = {
  id: 'account1',
  username: 'a',
  password: 'a',
  userId: 'user1',
  type: 'AP',
  status: 'ACTIVE',
}

export const USER_1 = {
  id: 'user1',
  firstName: 'user',
  lastName: 'One',
  email: 'user.one@mail.com',
  roles: ['admin'],
}

export const PARTICIPANT_1 = {
  id: 'participant1',
  sessionId: 'session1',
  userId: 'user1',
  status: 'ACCEPTED',
  statusDate: new Date(1666246704449),
}

export const resetDatabase = () => {
  return Promise.allSettled([
    mongoose.connection.db.dropCollection('accounts'),
    mongoose.connection.db.dropCollection('users'),
    mongoose.connection.db.dropCollection('sections'),
    mongoose.connection.db.dropCollection('members'),
    mongoose.connection.db.dropCollection('sessions'),
    mongoose.connection.db.dropCollection('participants')
  ])
    .finally(() => {
      createAccountModel()
      createUserModel()
      createSectionModel()
      createMemberModel()
      createSessionModel()
      createParticipantModel()
    })
}