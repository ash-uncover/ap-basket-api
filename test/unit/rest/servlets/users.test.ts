import request from 'supertest'

import { LogConfig } from '@uncover/js-utils-logger'
import { HttpUtils } from '@uncover/js-utils'

import app from '../../../../src/rest'
import connection from '../../../../src/database/connection'
import SCHEMAS from '../../../../src/database/schemas'
import { ACCOUNT_1, resetDatabase, TOKEN_1, USER_1 } from '../test.data'

describe('/users', () => {

  beforeAll((done) => {
    LogConfig.off()
    connection.open(() => done())
  })

  beforeEach((done) => {
    resetDatabase()
      .then(() => Promise.all([
        new SCHEMAS.ACCOUNTS.model(ACCOUNT_1).save(),
        new SCHEMAS.USERS.model(USER_1).save(),
      ]))
      .then(() => {
        done()
      })
  })

  afterAll((done) => {
    resetDatabase().then(() => connection.close(() => done()))
  })

  describe('/:userId', () => {

    describe('GET', () => {

      test('When no token is provided', () => {
        return request(app)
          .get(`/rest/users/${USER_1.id}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
          })
      })

      test('When accessing a user that does not exist', () => {
        return request(app)
          .get('/rest/users/dummy')
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          })
      })

      test('When a valid token is provided', () => {
        return request(app)
          .get(`/rest/users/${USER_1.id}`)
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
          })
      })
    })

    describe('PATCH', () => {

      test('When no token is provided', () => {
        return request(app)
          .patch(`/rest/users/${USER_1.id}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
          })
      })

      test('When accessing a user that does not exist', () => {
        return request(app)
          .patch('/rest/users/dummy')
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          })
      })
    })

    describe('DELETE', () => {

      test('When no token is provided', () => {
        return request(app)
          .delete(`/rest/users/${USER_1.id}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
          })
      })

      test('When accessing a user that does not exist', () => {
        return request(app)
          .delete('/rest/users/dummy')
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          })
      })
    })

    describe('/members', () => {

      describe('GET', () => {

        test('When no token is provided', () => {
          return request(app)
            .get(`/rest/users/${USER_1.id}/members`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
            })
        })

        test('When accessing a user that does not exist', () => {
          return request(app)
            .get('/rest/users/dummy/members')
            .set({ Authorization: TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            })
        })

        test('When the call is valid', () => {
          return request(app)
            .get(`/rest/users/${USER_1.id}/members`)
            .set({ Authorization: TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
            })
        })
      })
    })

    describe('/participants', () => {

      describe('GET', () => {

        test('When no token is provided', () => {
          return request(app)
            .get(`/rest/users/${USER_1.id}/participants`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
            })
        })

        test('When accessing a user that does not exist', () => {
          return request(app)
            .get('/rest/users/dummy/participants')
            .set({ Authorization: TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            })
        })

        test('When the call is valid', () => {
          return request(app)
            .get(`/rest/users/${USER_1.id}/participants`)
            .set({ Authorization: TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
            })
        })
      })
    })

  })
});