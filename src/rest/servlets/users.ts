import SCHEMAS from '../../database/schemas'

import ERRORS, {
  sendError
} from '../../rest/servlet-error'

import {
  defaultPost,
  defaultGet,
  defaultPut,
  defaultPatch,
  defaultDelete,
  defaultGetDeep,
  checkExists,
} from '../../rest/servlet-base'

import Logger from '@uncover/js-utils-logger'
const LOGGER = new Logger('REST-USERS')

export const checkUser = function(req, res, next) {
  try {
    checkExists(SCHEMAS.USERS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

export const postUser = function(req, res, next) {

  try {
    defaultPost(SCHEMAS.USERS, req, res, next, (error) => {
      if (error && error.code === 11000) {
        if (error.message.indexOf('username') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_USERNAME_INUSE)
        } else if (error.message.indexOf('email') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_EMAIL_INUSE)
        }
      } else if (error && error.name === 'ValidationError') {
        sendError(LOGGER, res, {
          status: 400,
          error: error.message
        })
      } else {
        res.send(500, error)
      }
    })
  } catch (error) {
    res.send(500, error)
  }
}

export const getUser = function(req, res, next) {
  try {
    defaultGet(SCHEMAS.USERS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

export const putUser = function(req, res, next) {
  LOGGER.debug(JSON.stringify(req.body))
  try {
    defaultPut(SCHEMAS.USERS, req, res, next, (error) => {
      if (error && error.code === 11000) {
        if (error.message.indexOf('username') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_USERNAME_INUSE)
        } else if (error.message.indexOf('email') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_EMAIL_INUSE)
        }
      } else if (error && error.name === 'ValidationError') {
        sendError(LOGGER, res, {
          status: 400,
          error: error.message
        })
      } else {
        res.send(500, error)
      }
    })
  } catch (error) {
    res.send(500, error)
  }
}

export const patchUser = function(req, res, next) {
  LOGGER.debug(JSON.stringify(req.body))
  try {
    defaultPatch(SCHEMAS.USERS, req, res, next, (error) => {
      if (error && error.code === 11000) {
        if (error.message.indexOf('username') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_USERNAME_INUSE)
        } else if (error.message.indexOf('email') !== -1) {
          sendError(LOGGER, res, ERRORS.USER_EMAIL_INUSE)
        }
      } else if (error && error.name === 'ValidationError') {
        sendError(LOGGER, res, {
          status: 400,
          error: error.message
        })
      } else {
        res.send(500, error)
      }
    })
  } catch (error) {
    res.send(500, error)
  }
}

export const deleteUser = function(req, res, next) {
  try {
    defaultDelete(SCHEMAS.USERS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

export const getUserMembers = function(req, res, next) {
  try {
    defaultGetDeep(SCHEMAS.MEMBERS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

export const getUserParticipants = function(req, res, next) {
  try {
    defaultGetDeep(SCHEMAS.PARTICIPANTS, req, res, next, null)
  } catch (error) {
    res.send(500, error)
  }
}

const addRoutes = (app) => {
  app.get('/rest/users/:userId', checkUser, getUser)
  app.put('/rest/users/:userId', checkUser, putUser)
  app.patch('/rest/users/:userId', checkUser, patchUser)
  app.delete('/rest/users/:userId', checkUser, deleteUser)

  app.get('/rest/users/:userId/members', checkUser, getUserMembers)
  app.get('/rest/users/:userId/participants', checkUser, getUserParticipants)
}

export default addRoutes
