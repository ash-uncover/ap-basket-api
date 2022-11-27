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
const LOGGER = new Logger('REST-PLACES')

export const postPlace = function(req, res, next) {
  defaultPost(SCHEMAS.PLACES, req, res, next, null)
}

export const getPlaces = function(req, res, next) {
  defaultGetAll(SCHEMAS.PLACES, req, res, next, null)
}

export const getPlace = function(req, res, next) {
  defaultGet(SCHEMAS.PLACES, req, res, next, null)
}

export const putPlace = function(req, res, next) {
  defaultPut(SCHEMAS.PLACES, req, res, next, null)
}

export const patchPlace = function(req, res, next) {
  defaultPatch(SCHEMAS.PLACES, req, res, next, null)
}

export const deletePlace = function(req, res, next) {
  defaultDelete(SCHEMAS.PLACES, req, res, next, null)
}

const addRoutes = (app) => {
  app.post('/rest/places', postPlace)
  app.get('/rest/places', getPlaces)
  app.get('/rest/places/:placeId', getPlace)
  app.put('/rest/places/:placeId', putPlace)
  app.patch('/rest/places/:placeId', patchPlace)
  app.delete('/rest/places/:placeId', deletePlace)
}
export default addRoutes