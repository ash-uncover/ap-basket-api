import SCHEMAS, {
  removeReserved,
  removePrivate
} from '../../database/schemas'

import {
  HttpUtils
} from '@uncover/js-utils'

import {
  defaultPost,
  defaultGet,
  defaultGetDeep,
  defaultPatch,
  defaultDelete,
  defaultPut,
  handleError
} from '../../rest/servlet-base'

import Logger from '@uncover/js-utils-logger'
const LOGGER = new Logger('REST-RELATIONS')

export const postSection = async (req, res, next) => {
  defaultPost(SCHEMAS.SECTIONS, req, res, next, null)
}

export const getSection = async (req, res, next) => {
  defaultGet(SCHEMAS.SECTIONS, req, res, next, null)
}

export const putSection = async (req, res, next) => {
  defaultPut(SCHEMAS.SECTIONS, req, res, next, null)
}

export const deleteSection = async (req, res, next) => {
  defaultDelete(SCHEMAS.SECTIONS, req, res, next, null)
}

export const getSectionMembers = function(req, res, next) {
  try {
    defaultGetDeep(SCHEMAS.MEMBERS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

const addRoutes = (app) => {
  app.post('/rest/sections/', postSection)
  app.get('/rest/sections/:sectionId', getSection)
  app.put('/rest/sections/:sectionId', putSection)
  app.delete('/rest/sections/:sectionId', deleteSection)

  app.get('/rest/sections/:sectionId/members', getSectionMembers)
}

export default addRoutes

