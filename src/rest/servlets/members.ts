import SCHEMAS from '../../database/schemas'

import {
  defaultPost,
  defaultGet,
  defaultPut,
  defaultPatch,
  defaultDelete,
} from '../../rest/servlet-base'

import Logger from '@uncover/js-utils-logger'
const LOGGER = new Logger('REST-MEMBERS')

export const postMember = function(req, res, next) {
  defaultPost(SCHEMAS.MEMBERS, req, res, next, null)
}

export const getMember = function(req, res, next) {
  defaultGet(SCHEMAS.MEMBERS, req, res, next, null)
}

export const putMember = function(req, res, next) {
  defaultPut(SCHEMAS.MEMBERS, req, res, next, null)
}

export const patchMember = function(req, res, next) {
  defaultPatch(SCHEMAS.MEMBERS, req, res, next, null)
}

export const deleteMember = function(req, res, next) {
  defaultDelete(SCHEMAS.MEMBERS, req, res, next, null)
}

const addRoutes = (app) => {
  app.post('/rest/members/', postMember)
  app.get('/rest/members/:memberId', getMember)
  app.put('/rest/members/:memberId', putMember)
  app.patch('/rest/members/:memberId', patchMember)
  app.delete('/rest/members/:memberId', deleteMember)
}
export default addRoutes