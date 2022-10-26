import {
  HttpUtils,
} from '@uncover/js-utils'

export const sendError = (logger, res, error) => {
  logger.debug(`HTTP ${error.status} - ${error.error}`)
  res.status(error.status).send({ error: error.error })
}

const ERRORS = {
  NOT_FOUND: {
    error: 'NOT_FOUND',
    status: 404
  },
  INTERNAL: {
    error: 'INTERNAL',
    status: HttpUtils.HttpStatus.ERROR
  },
  USER_USERNAME_INUSE: {
    error: 'USER_USERNAME_INUSE',
    status: 400
  },
  USER_EMAIL_INUSE: {
    error: 'USER_EMAIL_INUSE',
    status: 400
  },

  AUTH_REGISTER_ACCOUNT_EXISTS: {
    error: 'AUTH_REGISTER_ACCOUNT_EXISTS',
    status: HttpUtils.HttpStatus.FORBIDDEN
  },
  AUTH_REGISTER_MAIL_ERROR: {
    error: 'AUTH_REGISTER_MAIL_ERROR',
    status: HttpUtils.HttpStatus.ERROR
  },

  AUTH_REGISTER_CONFIRM_ACCOUNT_INVALID: {
    error: 'AUTH_REGISTER_CONFIRM_ACCOUNT_INVALID',
    status: HttpUtils.HttpStatus.FORBIDDEN
  },
  AUTH_REGISTER_CONFIRM_ACCOUNT_EXISTS: {
    error: 'AUTH_REGISTER_CONFIRM_ACCOUNT_EXISTS',
    status: HttpUtils.HttpStatus.FORBIDDEN
  },
  AUTH_REGISTER_CONFIRM_TOKEN_INVALID: {
    error: 'AUTH_REGISTER_CONFIRM_TOKEN_INVALID',
    status: HttpUtils.HttpStatus.FORBIDDEN
  },
  AUTH_REGISTER_CONFIRM_TOKEN_EXPIRED: {
    error: 'AUTH_REGISTER_CONFIRM_TOKEN_EXPIRED',
    status: HttpUtils.HttpStatus.FORBIDDEN
  },

  MEMBER_NOT_FOUND: {
    error: 'MEMBER_NOT_FOUND',
    status: HttpUtils.HttpStatus.NOT_FOUND
  },

  PARTICIPANT_NOT_FOUND: {
    error: 'PARTICIPANT_NOT_FOUND',
    status: HttpUtils.HttpStatus.NOT_FOUND
  },

  SECTION_NOT_FOUND: {
    error: 'SECTION_NOT_FOUND',
    status: HttpUtils.HttpStatus.NOT_FOUND
  },

  SESSION_NOT_FOUND: {
    error: 'SESSION_NOT_FOUND',
    status: HttpUtils.HttpStatus.NOT_FOUND
  },

  USER_NOT_FOUND: {
    error: 'USER_NOT_FOUND',
    status: HttpUtils.HttpStatus.NOT_FOUND
  },
}

export default ERRORS