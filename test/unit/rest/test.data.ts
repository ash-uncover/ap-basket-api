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

export const ACCOUNT_2 = {
  id: 'account2',
  username: 'a',
  password: 'a',
  userId: 'user2',
  type: 'AP',
  status: 'ACTIVE',
}

export const TOKEN_1 = 'Basic YTph'
export const USER_1 = {
  id: 'user1',
  firstName: 'user',
  lastName: 'One',
  email: 'user.one@mail.com',
  roles: ['admin'],
}
export const USER_2 = {
  id: 'user2',
  firstName: 'user',
  lastName: 'One',
  email: 'user.one@mail.com',
  roles: ['admin'],
}

export const SECTION_1 = {
  id: 'section1',
  name: 'Section 1',
}
export const SECTION_2 = {
  id: 'section2',
  name: 'Section 2',
}

export const MEMBER_1 = {
  id: 'member1',
  sectionId: 'section1',
  userId: 'user1',
  date: 1666246504449,
  roles: ['sectionAdmin'],
}
export const MEMBER_2 = {
  id: 'member2',
  sectionId: 'section2',
  userId: 'user2',
  date: 1666246504449,
  roles: [''],
}

export const SESSION_1 = {
  id: 'session1',
  sectionId: 'section1',
  maxParticipants: 10,
  date: 1969246904449,
}
export const SESSION_2 = {
  id: 'session2',
  sectionId: 'section2',
  maxParticipants: 10,
  date: 1969246904449,
}

export const PARTICIPANT_1 = {
  id: 'participant1',
  sessionId: 'session1',
  userId: 'user1',
  status: 'ACCEPTED',
  statusDate: new Date(1666246704449),
}
export const PARTICIPANT_2 = {
  id: 'participant2',
  sessionId: 'session2',
  userId: 'user2',
  status: 'DECLINED',
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
    .finally(() => Promise.allSettled([
      createAccountModel(),
      createUserModel(),
      createSectionModel(),
      createMemberModel(),
      createSessionModel(),
      createParticipantModel(),
    ]))
}