import SCHEMAS from '../../database/schemas'

import {
  defaultPost,
  defaultGet,
  defaultPut,
  defaultDelete,
  defaultGetDeep,
} from '../../rest/servlet-base'

import Logger from '@uncover/js-utils-logger'
const LOGGER = new Logger('REST-THREADS')

export const postSession = function(req, res, next) {
  defaultPost(SCHEMAS.SESSIONS, req, res, next, null)
}

export const getSession = function(req, res, next) {
  defaultGet(SCHEMAS.SESSIONS, req, res, next, null)
}

export const putSession = function(req, res, next) {
  defaultPut(SCHEMAS.SESSIONS, req, res, next, null)
}

export const patchSession = function(req, res, next) {
  defaultPut(SCHEMAS.SESSIONS, req, res, next, null)
}

export const deleteSession = function(req, res, next) {
  defaultDelete(SCHEMAS.SESSIONS, req, res, next, null)
}

export const getSessionParticipants = function(req, res, next) {
  try {
    defaultGetDeep(SCHEMAS.PARTICIPANTS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

const addRoutes = (app) => {
  app.post('/rest/sessions/', postSession)
  app.get('/rest/sessions/:sessionId', getSession)
  app.put('/rest/sessions/:sessionId', putSession)
  app.patch('/rest/sessions/:sessionId', patchSession)
  app.delete('/rest/sessions/:sessionId', deleteSession)

  app.get('/rest/sessions/:sessionId/participants', getSessionParticipants)
}
export default addRoutes
