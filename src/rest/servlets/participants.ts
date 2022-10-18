import SCHEMAS from '../../database/schemas'

import {
  defaultPost,
  defaultGet,
  defaultPut,
  defaultPatch,
  defaultDelete,
} from '../../rest/servlet-base'

import Logger from '@uncover/js-utils-logger'
const LOGGER = new Logger('REST-PARTICIPANTS')

export const postParticipant = function(req, res, next) {
  defaultPost(SCHEMAS.PARTICIPANTS, req, res, next, null)
}

export const getParticipant = function(req, res, next) {
  defaultGet(SCHEMAS.PARTICIPANTS, req, res, next, null)
}

export const putParticipant = function(req, res, next) {
  defaultPut(SCHEMAS.PARTICIPANTS, req, res, next, null)
}

export const patchParticipant = function(req, res, next) {
  defaultPatch(SCHEMAS.PARTICIPANTS, req, res, next, null)
}

export const deleteParticipant = function(req, res, next) {
  defaultDelete(SCHEMAS.PARTICIPANTS, req, res, next, null)
}

const addRoutes = (app) => {
  app.post('/rest/participants/', postParticipant)
  app.get('/rest/participants/:participantId', getParticipant)
  app.put('/rest/participants/:participantId', putParticipant)
  app.patch('/rest/participants/:participantId', patchParticipant)
  app.delete('/rest/participants/:participantId', deleteParticipant)
}
export default addRoutes