import * as mongoose from 'mongoose'
import Logger from '@uncover/js-utils-logger'

import CONFIG from '../configuration'

const LOGGER = new Logger('Mongo Connection')

let urlmongo = CONFIG.ALPHA_BASKET_DATABASE_CONN

const connection = {
  open: (callback) => {

    console.log(urlmongo)
    mongoose.connect(urlmongo, {})
      .then(() => {
        LOGGER.info(`Connected to database "${urlmongo}"`)
        callback && callback()
      })
      .catch(() => {
        LOGGER.error(`Failed to connect to database "${urlmongo}"`)
      })
  }
}

export default connection