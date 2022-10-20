import {
  v4 as uuidv4
} from 'uuid'

import {
  removeReserved,
  removePrivate,
  INTERNAL_FIELDS
} from '../database/schemas'

import {
  HttpUtils
} from '@uncover/js-utils'

import Logger from '@uncover/js-utils-logger'
const LOGGER = new Logger('servlet-base')

export const handleError = (error, res, onError?) => {
  onError ? onError(error) : res.status(HttpUtils.HttpStatus.ERROR).send(error)
}

const FIELD_FILTERING = INTERNAL_FIELDS.map(f => `-${f}`).join(' ')

export const defaultGetAll = async (schema, req, res, next?, onError?) => {
  try {
    const data = await schema.model.find().select(FIELD_FILTERING).exec()
    res.json(data)
  } catch (error) {
    handleError(error, res, onError)
  }
}

export const defaultPost = async (schema, req, res, next, onError) => {
  try {
    const data = new schema.model(removeReserved(req.body))
    data.id = uuidv4()
    await data.save()
    const created = await schema.model.findOne({ id: data.id }).select(FIELD_FILTERING).exec()
    res.status(HttpUtils.HttpStatus.CREATED).json(created)
  } catch (error) {
    handleError(error, res, onError)
  }
}

export const defaultGet = async (schema, req, res, next, onError) => {
  const id = req.params[`${schema.name}Id`]
  try {
    const data = await schema.model.findOne({ id }).select(FIELD_FILTERING).exec()
    data ? res.json(data) : res.sendStatus(HttpUtils.HttpStatus.NOT_FOUND)
  } catch (error) {
    handleError(error, res, onError)
  }
}

export const defaultPut = async (schema, req, res, next, onError) => {
  const id = req.params[`${schema.name}Id`]
  try {
    let data = await schema.model.findOne({ id }).exec()
    if (data) {
      Object.assign(data, removeReserved(req.body))
      await data.save()
      data = await schema.model.findOne({ id }).select(FIELD_FILTERING).exec()
      data ? res.json(data) : res.sendStatus(HttpUtils.HttpStatus.NOT_FOUND)
    } else {
      res.sendStatus(HttpUtils.HttpStatus.NOT_FOUND)
    }
  } catch (error) {
    handleError(error, res, onError)
  }
}

export const defaultPatch = async (schema, req, res, next, onError) => {
  const id = req.params[`${schema.name}Id`]
  try {
    let data = await schema.model.findOne({ id }).exec()
    if (data) {
      Object.assign(data, removeReserved(req.body))
      data = await schema.model.findOne({ id }).select(FIELD_FILTERING).exec()
      data ? res.json(data) : res.sendStatus(HttpUtils.HttpStatus.NOT_FOUND)
    } else {
      res.sendStatus(HttpUtils.HttpStatus.NOT_FOUND)
    }
  } catch (error) {
    handleError(error, res, onError)
  }
}

export const defaultDelete = async (schema, req, res, next, onError) => {
  const id = req.params[`${schema.name}Id`]
  try {
    await schema.model.deleteOne({ id })
    res.sendStatus(HttpUtils.HttpStatus.REMOVED)
  } catch (error) {
    handleError(error, res, onError)
  }
}

export const defaultGetDeep = async (schema, req, res, next, onError) => {
  try {
    const data = await schema.model.find(req.params).select(FIELD_FILTERING).exec()
    res.json(data)
  } catch (error) {
    handleError(error, res, onError)
  }
}
