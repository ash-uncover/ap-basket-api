import SCHEMAS from '../../database/schemas'

import {
  defaultPost,
  defaultGet,
  defaultPut,
  defaultPatch,
  defaultDelete,
  defaultGetAll,
} from '../servlet-base'

import Logger from '@uncover/js-utils-logger'
const LOGGER = new Logger('REST-NEWS')

export const postNew = function(req, res, next) {
  defaultPost(SCHEMAS.NEWS, req, res, next, null)
}

export const getNews = function(req, res, next) {
  defaultGetAll(SCHEMAS.NEWS, req, res, next, null)
}

export const getNew = function(req, res, next) {
  defaultGet(SCHEMAS.NEWS, req, res, next, null)
}

export const putNew = function(req, res, next) {
  defaultPut(SCHEMAS.NEWS, req, res, next, null)
}

export const patchNew = function(req, res, next) {
  defaultPatch(SCHEMAS.NEWS, req, res, next, null)
}

export const deleteNew = function(req, res, next) {
  defaultDelete(SCHEMAS.NEWS, req, res, next, null)
}

const addRoutes = (app) => {
  app.post('/rest/news', postNew)
  app.get('/rest/news', getNews)
  app.get('/rest/news/:newId', getNew)
  app.put('/rest/news/:newId', putNew)
  app.patch('/rest/news/:newId', patchNew)
  app.delete('/rest/news/:newId', deleteNew)
}
export default addRoutes