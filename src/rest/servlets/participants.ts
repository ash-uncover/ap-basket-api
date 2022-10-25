import {
  v4 as uuidv4
} from 'uuid'

import SCHEMAS, { removeReserved } from '../../database/schemas'

import {
  defaultGet,
  handleError,
  FIELD_FILTERING,
  checkExists,
} from '../../rest/servlet-base'

import Logger from '@uncover/js-utils-logger'
import { HttpUtils } from '@uncover/js-utils'
const LOGGER = new Logger('REST-PARTICIPANTS')

export const checkParticipant = function(req, res, next) {
  try {
    checkExists(SCHEMAS.PARTICIPANTS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

export const postParticipant = async function(req, res, next) {
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

export const getParticipant = function(req, res, next) {
  defaultGet(SCHEMAS.PARTICIPANTS, req, res, next, null)
}

export const putParticipantStatus = async function(req, res, next) {
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
  app.post('/rest/participants', postParticipant)

  app.get('/rest/participants/:participantId', checkParticipant, getParticipant)

  app.put('/rest/participants/:participantId/status', checkParticipant, putParticipantStatus)

}
export default addRoutes