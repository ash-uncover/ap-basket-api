import {
  HttpUtils,
} from '@uncover/js-utils'

import Logger from '@uncover/js-utils-logger'
import ERRORS, { sendError } from '../../rest/servlet-error'
const LOGGER = new Logger('REST-AUTH')

export const getAuth = (req: any, res: any, next: any) => {
  res.status(HttpUtils.HttpStatus.OK).send({userId: req.__context.userId })
}

export const deleteAuth = (req: any, res: any, next: any) => {
  res.status(HttpUtils.HttpStatus.OK).send()
}