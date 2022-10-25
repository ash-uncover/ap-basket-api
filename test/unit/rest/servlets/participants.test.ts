import request from 'supertest'

import { LogConfig } from '@uncover/js-utils-logger';
import { HttpUtils } from '@uncover/js-utils';

import app from '../../../../src/rest'
import connection from '../../../../src/database/connection'
import { ACCOUNT_1, PARTICIPANT_1, resetDatabase, USER_1 } from '../test.data';
import SCHEMAS from '../../../../src/database/schemas';

describe('/participants', () => {

  const TOKEN_1 = 'Basic YTph'

  beforeAll((done) => {
    LogConfig.off()
    connection.open(() => done())
  })

  beforeEach((done) => {
    resetDatabase()
      .then(() => Promise.allSettled([
        new SCHEMAS.ACCOUNTS.model(ACCOUNT_1).save(),
        new SCHEMAS.USERS.model(USER_1).save(),
        new SCHEMAS.PARTICIPANTS.model(PARTICIPANT_1).save()
      ]))
      .then(() => done())
  })

  afterAll((done) => {
    resetDatabase().then(() => connection.close(done))
  })

  describe('POST', () => {
  })

  describe('/:participantId', () => {

    describe('GET', () => {

      test('When no token is provided', () => {
        return request(app)
          .get(`/rest/participants/${PARTICIPANT_1.id}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
          })
      })

      test('When accessing a participant that does not exist', () => {
        return request(app)
          .get('/rest/participants/dummy')
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          })
      })

      test('When a valid token is provided', () => {
        return request(app)
          .get(`/rest/participants/${PARTICIPANT_1.id}`)
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
          })
      })
    })

    describe('/status', () => {

      describe('PUT', () => {

        test('When no token is provided', () => {
          return request(app)
            .put(`/rest/participants/${PARTICIPANT_1.id}/status`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
            })
        })

        test('When accessing a participant that does not exist', () => {
          return request(app)
            .put('/rest/participants/dummy/status')
            .set({ Authorization: TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            })
        })

        test('When sending no status', () => {
          return request(app)
            .put(`/rest/participants/${PARTICIPANT_1.id}/status`)
            .set({ Authorization: TOKEN_1 })
            .send({})
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.BAD_REQUEST)
            })
        })

        test('When sending invalid status', () => {
          return request(app)
            .put(`/rest/participants/${PARTICIPANT_1.id}/status`)
            .set({ Authorization: TOKEN_1 })
            .send({ status: 'DUMMY' })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.BAD_REQUEST)
            })
        })
      })
    })
  })
});