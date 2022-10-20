import * as mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

// Common stuf
export const SchemaBase = {
  id: { type: String, required: true },
  _creationDate: { type: Date },
  _lastUpdateDate: { type: Date }
}
export interface DocumentBase extends mongoose.Document {
  id: string,
  _creationDate:  Date,
  _lastUpdateDate: Date
}

export const INTERNAL_FIELDS = [
  '_id',
  '_creationDate',
  '_lastUpdateDate',
  '_deleted',
  '__v',
]
export const RESERVED_FIELDS = [
  ...INTERNAL_FIELDS,
  'id',
]

export const removeReserved = (data) => {
  RESERVED_FIELDS.forEach((field) => {
    delete data[field]
  })
  return data
}

export const removePrivate = (data) => {
  ['_id', '__v', '_deleted'].forEach((field) => {
    delete data[field]
  })
  return data
}

export const preSave = function (next) {
  let now = new Date()
  this.id || (this.id = uuidv4())
  this._creationDate || (this._creationDate = now)
  this._lastUpdateDate = now
  next()
}

// Accounts collection
export const AccountName = 'account'
export const AccountCollection = `${AccountName}s`
export interface IAccount extends DocumentBase {
  username: string,
  password: string,
  type: string,
  userId: string,
  status: string,
  actionToken: string,
  actionDate: Date,
}
export const AccountSchema = new mongoose.Schema(Object.assign({
  username: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, required: true },
  actionToken: { type: String },
  actionDate: { type: Date },
}, SchemaBase))
AccountSchema.pre('save', preSave)
export const AccountModel = mongoose.model<IAccount>(AccountCollection, AccountSchema)


// Users collection
export const UserName = 'user'
export const UserCollection = `${UserName}s`
export interface IUser extends DocumentBase {
  firstName: string,
  lastName: string,
  email: string,
  roles: string[],
}
export const UserSchema = new mongoose.Schema(Object.assign({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  roles: { type: [String] },
}, SchemaBase))
UserSchema.pre('save', preSave)
export const UserModel = mongoose.model<IUser>(UserCollection, UserSchema)


// Sections collection
export const SectionName = 'section'
export const SectionCollection = `${SectionName}s`
export interface ISection extends DocumentBase {
  name: string,
}
export const SectionSchema = new mongoose.Schema(Object.assign({
  name: { type: String, required: true },
}, SchemaBase))
SectionSchema.pre('save', preSave)
export const SectionModel = mongoose.model<ISection>(SectionCollection, SectionSchema)


// MEMBERS collection
export const MemberName = 'member'
export const MemberCollection = `${MemberName}s`
export interface IMember extends DocumentBase {
  sectionId: string,
  userId: string,
}
export const MemberSchema = new mongoose.Schema(Object.assign({
  sectionId: { type: String, required: true },
  userId: { type: String, required: true },
}, SchemaBase))
MemberSchema.pre('save', preSave)
export const MemberModel = mongoose.model(MemberCollection, MemberSchema)

// SESSIONS collection
export const SessionName = 'session'
export const SessionCollection = `${SessionName}s`
export interface ISession extends DocumentBase {
  sectionId: string,
  date: Date,
}
export const SessionSchema = new mongoose.Schema(Object.assign({
  sectionId: { type: String },
  date: { type: Date },
}, SchemaBase))
SessionSchema.pre('save', preSave)
export const SessionModel = mongoose.model(SessionCollection, SessionSchema)


// PARTICIPANTS collection
export const ParticipantName = 'participant'
export const ParticipantCollection = `${ParticipantName}s`
export interface IParticipant extends DocumentBase {
  sessionId: string,
  userId: string,
  status: string,
  date: Date,
}
export const ParticipantSchema = new mongoose.Schema(Object.assign({
  sessionId: { type: String },
  userId: { type: String },
  status: { type: String },
  date: { type: Date },
}, SchemaBase))
ParticipantSchema.pre('save', preSave)
export const ParticipantModel = mongoose.model(ParticipantCollection, ParticipantSchema)


const SCHEMAS = {
  ACCOUNTS: {
    model: AccountModel,
    name: AccountName,
    collection: AccountCollection,
  },
  USERS: {
    model: UserModel,
    name: UserName,
    collection: UserCollection,
  },
  SECTIONS: {
    model: SectionModel,
    name: SectionName,
    collection: SectionCollection,
  },
  MEMBERS: {
    model: MemberModel,
    name: MemberName,
    collection: MemberCollection,
  },
  SESSIONS: {
    model: SessionModel,
    name: SessionName,
    collection: SessionCollection,
  },
  PARTICIPANTS: {
    model: ParticipantModel,
    name: ParticipantName,
    collection: ParticipantCollection,
  },
}

export default SCHEMAS
