/*

@startuml

skinparam componentStyle rectangle

[section3]

[member1] -up-> [user1]
[member1] -up-> [section1]

[member2] -up-> [user2]
[member2] -up-> [section2]

[member3] -up-> [user3]
[member3] -up-> [section1]

[member4] -up-> [user1]
[member4] -up-> [section2]

[session1] -up-> [section1]
[session2] -up-> [section2]
[session3] -up-> [section3]

[participant1] -up-> [session1]
[participant1] -up-> [user1]

[participant2] -up-> [session2]
[participant2] -up-> [user2]

[participant3] -up-> [session3]
[participant3] -up-> [user3]

[participant4] -up-> [session2]
[participant4] -up-> [user3]

@enduml

*/

import mongoose from "mongoose";
import { createAccountModel, createMemberModel, createParticipantModel, createSectionModel, createSessionModel, createUserModel } from "../../../src/database/schemas";

export const TOKEN_1 = 'Basic YTph'
export const ACCOUNT_1 = {
  id: 'account1',
  username: 'a',
  password: 'a',
  userId: 'user1',
  type: 'AP',
  status: 'ACTIVE',
}
export const TOKEN_2 = 'Basic Yjpi'
export const ACCOUNT_2 = {
  id: 'account2',
  username: 'b',
  password: 'b',
  userId: 'user2',
  type: 'AP',
  status: 'ACTIVE',
}
export const TOKEN_3 = 'Basic Yzpj'
export const ACCOUNT_3 = {
  id: 'account3',
  username: 'c',
  password: 'c',
  userId: 'user3',
  type: 'AP',
  status: 'ACTIVE',
}

export const USER_1 = {
  id: 'user1',
  firstName: 'User',
  lastName: 'One',
  email: 'user.one@mail.com',
  roles: ['admin'],
}
export const USER_2 = {
  id: 'user2',
  firstName: 'User',
  lastName: 'Two',
  email: 'user.two@mail.com',
  roles: [],
}
export const USER_3 = {
  id: 'user3',
  firstName: 'User',
  lastName: 'Three',
  email: 'user.three@mail.com',
  roles: [],
}

export const SECTION_1 = {
  id: 'section1',
  name: 'Section 1',
}
export const SECTION_2 = {
  id: 'section2',
  name: 'Section 2',
}
export const SECTION_3 = {
  id: 'section3',
  name: 'Section 3',
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
  roles: ['sectionAdmin'],
}
export const MEMBER_3 = {
  id: 'member3',
  sectionId: 'section1',
  userId: 'user3',
  date: 1666246504449,
  roles: [],
}
export const MEMBER_4 = {
  id: 'member4',
  sectionId: 'section2',
  userId: 'user1',
  date: 1666246504449,
  roles: [],
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
export const SESSION_3 = {
  id: 'session3',
  sectionId: 'section3',
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
export const PARTICIPANT_3 = {
  id: 'participant3',
  sessionId: 'session3',
  userId: 'user3',
  status: 'DECLINED',
  statusDate: new Date(1666246704449),
}
export const PARTICIPANT_4 = {
  id: 'participant4',
  sessionId: 'session2',
  userId: 'user3',
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
    .then(() => Promise.allSettled([
      createAccountModel(),
      createUserModel(),
      createSectionModel(),
      createMemberModel(),
      createSessionModel(),
      createParticipantModel(),
    ]))
}