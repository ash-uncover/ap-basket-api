import {
  v4 as uuidv4
} from 'uuid'

import SCHEMAS, { removeReserved } from '../../database/schemas'

import {
  defaultGet,
  handleError,
  FIELD_FILTERING,
  checkExists,
  checkNotExists,
  checkExistsBody,
} from '../../rest/servlet-base'

import Logger from '@uncover/js-utils-logger'
import { HttpUtils } from '@uncover/js-utils'
const LOGGER = new Logger('REST-PARTICIPANTS')

export const checkParticipantExists = function (req, res, next) {
  try {
    checkExists(SCHEMAS.PARTICIPANTS, req, res, next, null)
  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const checkSessionExists = function (req, res, next) {
  try {
    checkExistsBody(SCHEMAS.SESSIONS, req, res, next, null)
  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const checkUserExists = function (req, res, next) {
  try {
    checkExistsBody(SCHEMAS.USERS, req, res, next, null)
  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const checkMemberExists = async function (req, res, next) {
  try {
    const session = await SCHEMAS.SESSIONS.model.findOne({ id: req.body.sessionId }).exec()
    const member = await SCHEMAS.MEMBERS.model.findOne({ sectionId: session.sectionId, userId: req.body.userId }).exec()
    if (member) {
      next()
    } else {
      res.status(HttpUtils.HttpStatus.NOT_FOUND).send({
        error: `${SCHEMAS.MEMBERS.name.toUpperCase()}_NOT_FOUND`
      })
    }
  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const checkParticipantNotExists = function (req, res, next) {
  try {
    checkNotExists(SCHEMAS.PARTICIPANTS, req, res, next, null)
  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const checkPostParticipantRights = async function (req, res, next) {
  try {
    const currentUser = await SCHEMAS.USERS.model.findOne({ id: req.__context.userId }).exec()

    if (currentUser.roles.includes('admin')) {
      return next()
    }

    const session = await SCHEMAS.SESSIONS.model.findOne({ id: req.body.sessionId }).exec()
    const currentMember = await SCHEMAS.MEMBERS.model.findOne({ sectionId: session.sectionId, userId: req.__context.userId }).exec()
    if (currentMember && currentMember.roles.includes('sectionAdmin')) {
      return next()
    }

    if (req.body.userId === req.__context.userId) {
      return next()
    }

    res.sendStatus(HttpUtils.HttpStatus.FORBIDDEN)

  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const checkPutParticipantRights = async function (req, res, next) {
  try {
    const currentUser = await SCHEMAS.USERS.model.findOne({ id: req.__context.userId }).exec()

    if (currentUser.roles.includes('admin')) {
      return next()
    }

    const participant = await SCHEMAS.PARTICIPANTS.model.findOne({ id: req.params.participantId }).exec()
    const session = await SCHEMAS.SESSIONS.model.findOne({ id: participant.sessionId }).exec()
    const currentMember = await SCHEMAS.MEMBERS.model.findOne({ sectionId: session.sectionId, userId: req.__context.userId }).exec()
    if (currentMember && currentMember.roles.includes('sectionAdmin')) {
      return next()
    }

    if (participant.userId === req.__context.userId) {
      return next()
    }

    res.sendStatus(HttpUtils.HttpStatus.FORBIDDEN)

  } catch (error) {
    res.status(HttpUtils.HttpStatus.ERROR).send(error)
  }
}

export const postParticipant = async function (req, res, next) {
  try {
    const data = new SCHEMAS.PARTICIPANTS.model(removeReserved(req.body))
    data.id = uuidv4()
    data.statusDate = new Date()
    await data.save()
    const created = await SCHEMAS.PARTICIPANTS.model.findOne({ id: data.id }).select(FIELD_FILTERING).exec()
    res.status(HttpUtils.HttpStatus.CREATED).json(created)
  } catch (error) {
    handleError(error, res)
  }
}

export const getParticipant = function (req, res, next) {
  defaultGet(SCHEMAS.PARTICIPANTS, req, res, next, null)
}

export const putParticipantStatus = async function (req, res, next) {
  if (['ACCEPTED', 'DECLINED'].includes(req.body?.status)) {
    const id = req.params[`${SCHEMAS.PARTICIPANTS.name}Id`]
    try {
      let data = await SCHEMAS.PARTICIPANTS.model.findOne({ id }).exec()
      if (data) {
        Object.assign(data, {
          status: req.body.status,
          statusDate: new Date()
        })
        await data.save()
        data = await SCHEMAS.PARTICIPANTS.model.findOne({ id }).select(FIELD_FILTERING).exec()
        data ? res.json(data) : res.sendStatus(HttpUtils.HttpStatus.NOT_FOUND)
      } else {
        res.sendStatus(HttpUtils.HttpStatus.NOT_FOUND)
      }
    } catch (error) {
      handleError(error, res)
    }
  } else {
    res.status(HttpUtils.HttpStatus.BAD_REQUEST).send('Status must be one of "ACCEPTED" | "DECLINED"')
  }
}

const addRoutes = (app) => {
  app.post(
    '/rest/participants',
    checkParticipantNotExists,
    checkSessionExists,
    checkUserExists,
    checkMemberExists,
    checkPostParticipantRights,
    postParticipant
  )

  app.get(
    '/rest/participants/:participantId',
    checkParticipantExists,
    getParticipant
  )

  app.put(
    '/rest/participants/:participantId/status',
    checkParticipantExists,
    checkPutParticipantRights,
    putParticipantStatus
  )

}
export default addRoutes