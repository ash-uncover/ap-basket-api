import express from 'express'

import Logger from '@uncover/js-utils-logger'

import {
  AccountModel
} from '../database/schemas'

import {
  HttpUtils,
  EncodeUtils,
} from '@uncover/js-utils'

import {
  getAuth,
  deleteAuth,
} from '../rest/servlets/auth'

import addMembersRoutes from '../rest/servlets/members'
import addNewsRoutes from '../rest/servlets/news'
import addParticipantsRoutes from '../rest/servlets/participants'
import addPlacesRoutes from '../rest/servlets/places'
import addSectionsRoutes from '../rest/servlets/sections'
import addSessionsRoutes from '../rest/servlets/sessions'
import addUsersRoutes from '../rest/servlets/users'

const LOGGER = new Logger('REST')

export const useHeaders = (req: any, res: any, next: any) => {
  LOGGER.debug('useHeaders')
  res.setHeader(
    HttpUtils.HttpHeader.ACCESS_CONTROL_ALLOW_ORIGIN,
    '*'
  )
  res.setHeader(
    HttpUtils.HttpHeader.ACCESS_CONTROL_ALLOW_HEADERS,
    [
      'Origin',
      'Accept',
      'Accept-Version',
      'Content-Length',
      'Content-MD5',
      'Content-Type',
      'Date',
      'Authorization'
    ].join(',')
  )
  res.setHeader(
    HttpUtils.HttpHeader.ACCESS_CONTROL_ALLOW_METHODS,
    [
      HttpUtils.HttpMethod.GET,
      HttpUtils.HttpMethod.POST,
      HttpUtils.HttpMethod.PUT,
      HttpUtils.HttpMethod.PATCH,
      HttpUtils.HttpMethod.DELETE,
      HttpUtils.HttpMethod.OPTIONS
    ].join(',')
  )
  return next()
}

export const useAuth = function(req: any, res: any, next: any) {
  LOGGER.debug('useAuth')
  const account = EncodeUtils.decodeBasicHeader(req.headers.authorization)
  AccountModel.findOne(account).select('-_id -__v').exec((err, data) => {
    if (err) {
      res.status(HttpUtils.HttpStatus.ERROR).send(err)
    } else if (data) {
      req.__context = data
      next()
    } else {
      res.status(HttpUtils.HttpStatus.UNAUTHORIZED).send()
    }
  })
}

export const useDebugRequest = function(req: any, res: any, next: any) {
  LOGGER.info(`${req.method} ${req.url}`)
  if (req.body) {
    LOGGER.debug(JSON.stringify(req.body))
  }
  next()
}

export const optionsRoute = (req: any, res: any, next: any) => {
  LOGGER.debug('optionsRoute')
  res.sendStatus(HttpUtils.HttpStatus.OK)
}

const app = express()

app.use(express.static('public'))

app.use(useHeaders)

app.options('*', optionsRoute)

app.use(useDebugRequest)

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(useAuth)

// Auth end point
app.get('/auth', getAuth)
app.delete('/auth', deleteAuth)

addMembersRoutes(app)
addNewsRoutes(app)
addParticipantsRoutes(app)
addPlacesRoutes(app)
addSectionsRoutes(app)
addSessionsRoutes(app)
addUsersRoutes(app)

export default app
