import SCHEMAS from '../../database/schemas'

import {
  defaultGet,
  defaultPost,
  defaultPatch,
  handleError,
  FIELD_FILTERING,
} from '../../rest/servlet-base'

import Logger from '@uncover/js-utils-logger'
import { HttpUtils } from '@uncover/js-utils'
const LOGGER = new Logger('REST-PARTICIPANTS')

export const postParticipant = function(req, res, next) {
  defaultPost(SCHEMAS.PARTICIPANTS, req, res, next, null)
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

  app.get('/rest/participants/:participantId', getParticipant)

  app.put('/rest/participants/:participantId/status', putParticipantStatus)

}
export default addRoutes