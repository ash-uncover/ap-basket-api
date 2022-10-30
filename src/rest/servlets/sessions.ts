import {
  v4 as uuidv4
} from 'uuid'

import SCHEMAS, { removeReserved } from '../../database/schemas'

import {
  defaultPost,
  defaultGet,
  defaultPut,
  defaultGetDeep,
  checkExistsBody,
  FIELD_FILTERING,
  handleError,
  checkExists,
} from '../../rest/servlet-base'

import Logger from '@uncover/js-utils-logger'
import { HttpUtils } from '@uncover/js-utils'
const LOGGER = new Logger('REST-THREADS')

export const checkSessionExists = function (req, res, next) {
  try {
    checkExists(SCHEMAS.SESSIONS, req, res, next, null)
  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const checkSectionExists = function (req, res, next) {
  try {
    checkExistsBody(SCHEMAS.SECTIONS, req, res, next, null)
  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const checkPostSessionRights = async function (req, res, next) {
  try {
    const currentUser = await SCHEMAS.USERS.model.findOne({ id: req.__context.userId }).exec()

    if (currentUser.roles.includes('admin')) {
      return next()
    }

    const currentMember = await SCHEMAS.MEMBERS.model.findOne({ sectionId: req.body.sectionId, userId: req.__context.userId }).exec()
    if (currentMember && currentMember.roles.includes('sectionAdmin')) {
      return next()
    }

    res.sendStatus(HttpUtils.HttpStatus.FORBIDDEN)

  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const checkPutSessionRights = async function (req, res, next) {
  try {
    const currentUser = await SCHEMAS.USERS.model.findOne({ id: req.__context.userId }).exec()

    if (currentUser.roles.includes('admin')) {
      return next()
    }

    const session = await SCHEMAS.SESSIONS.model.findOne({ id: req.params.sessionId }).exec()
    const currentMember = await SCHEMAS.MEMBERS.model.findOne({ sectionId: session.sectionId, userId: req.__context.userId }).exec()
    if (currentMember && currentMember.roles.includes('sectionAdmin')) {
      return next()
    }

    res.sendStatus(HttpUtils.HttpStatus.FORBIDDEN)

  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const postSession = async function (req, res, next) {
  try {
    const data = new SCHEMAS.SESSIONS.model(removeReserved(req.body))
    data.id = uuidv4()
    data.status = 'ACTIVE'
    await data.save()
    const created = await SCHEMAS.SESSIONS.model.findOne({ id: data.id }).select(FIELD_FILTERING).exec()
    res.status(HttpUtils.HttpStatus.CREATED).json(created)
  } catch (error) {
    handleError(error, res)
  }
}

export const getSession = function (req, res, next) {
  defaultGet(SCHEMAS.SESSIONS, req, res, next, null)
}

export const putSession = function (req, res, next) {
  const status = req?.body?.status
  if (status && !['ACCEPTED', 'CANCELED'].includes(status)) {
    return res.sendStatus(HttpUtils.HttpStatus.BAD_REQUEST)
  }
  defaultPut(SCHEMAS.SESSIONS, req, res, next, null)
}

export const getSessionParticipants = function (req, res, next) {
  try {
    defaultGetDeep(SCHEMAS.PARTICIPANTS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

const addRoutes = (app) => {
  app.post(
    '/rest/sessions',
    checkSectionExists,
    checkPostSessionRights,
    postSession
  )

  app.get(
    '/rest/sessions/:sessionId',
    checkSessionExists,
    getSession
  )
  app.put(
    '/rest/sessions/:sessionId',
    checkSessionExists,
    checkPutSessionRights,
    putSession
  )

  app.get(
    '/rest/sessions/:sessionId/participants',
    checkSessionExists,
    getSessionParticipants
  )
}
export default addRoutes
