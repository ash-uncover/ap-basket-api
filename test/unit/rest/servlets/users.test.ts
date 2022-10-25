import request from 'supertest'

import app from '../../../../src/rest'
import connection from '../../../../src/database/connection'
import { LogConfig } from '@uncover/js-utils-logger';
import { HttpUtils } from '@uncover/js-utils';
import SCHEMAS from '../../../../src/database/schemas';
import { ACCOUNT_1, resetDatabase, USER_1 } from '../test.data';

describe('/users', () => {

  const TOKEN = 'Basic YTph'
  const USER_1_ID = 'user1'

  beforeAll((done) => {
    connection.open(() => done())
    LogConfig.off()
  })

  beforeEach((done) => {
    resetDatabase()
      .then(() => Promise.allSettled([
        new SCHEMAS.ACCOUNTS.model(ACCOUNT_1).save(),
        new SCHEMAS.USERS.model(USER_1).save(),
      ]))
      .then(() => done())
  })

  afterAll((done) => {
    resetDatabase().then(() => connection.close(done))
  })

  describe('/:userId', () => {

    describe('GET', () => {

      test('When no token is provided', () => {
        return request(app)
          .get(`/rest/users/${USER_1_ID}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
          })
      })

      test('When accessing a user that does not exist', () => {
        return request(app)
          .get('/rest/users/dummy')
          .set({ Authorization: TOKEN })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          })
      })

      test('When a valid token is provided', () => {
        return request(app)
          .get(`/rest/users/${USER_1_ID}`)
          .set({ Authorization: TOKEN })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
          })
      })
    })

    describe('PATCH', () => {

      test('When no token is provided', () => {
        return request(app)
          .patch(`/rest/users/${USER_1_ID}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
          })
      })

      test('When accessing a user that does not exist', () => {
        return request(app)
          .patch('/rest/users/dummy')
          .set({ Authorization: TOKEN })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          })
      })
    })

    describe('DELETE', () => {

      test('When no token is provided', () => {
        return request(app)
          .delete(`/rest/users/${USER_1_ID}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
          })
      })

      test('When accessing a user that does not exist', () => {
        return request(app)
          .delete('/rest/users/dummy')
          .set({ Authorization: TOKEN })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          })
      })
    })

    describe('/members', () => {

      describe('GET', () => {

        test('When no token is provided', () => {
          return request(app)
            .get(`/rest/users/${USER_1_ID}/members`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
            })
        })

        test('When accessing a user that does not exist', () => {
          return request(app)
            .get('/rest/users/dummy/members')
            .set({ Authorization: TOKEN })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            })
        })

        test('When the call is valid', () => {
          return request(app)
            .get(`/rest/users/${USER_1_ID}/members`)
            .set({ Authorization: TOKEN })
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
            .get(`/rest/users/${USER_1_ID}/participants`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
            })
        })

        test('When accessing a user that does not exist', () => {
          return request(app)
            .get('/rest/users/dummy/participants')
            .set({ Authorization: TOKEN })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            })
        })

        test('When the call is valid', () => {
          return request(app)
            .get(`/rest/users/${USER_1_ID}/participants`)
            .set({ Authorization: TOKEN })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
            })
        })
      })
    })

  })
});