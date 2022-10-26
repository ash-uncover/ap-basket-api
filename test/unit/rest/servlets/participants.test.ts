import request from 'supertest'

import { LogConfig } from '@uncover/js-utils-logger'
import { HttpUtils } from '@uncover/js-utils'

import app from '../../../../src/rest'
import connection from '../../../../src/database/connection'
import { ACCOUNT_1, ACCOUNT_2, ACCOUNT_3, MEMBER_1, MEMBER_2, MEMBER_3, MEMBER_4, PARTICIPANT_1, PARTICIPANT_2, PARTICIPANT_3, PARTICIPANT_4, resetDatabase, SECTION_1, SECTION_2, SECTION_3, SESSION_1, SESSION_2, SESSION_3, TOKEN_1, TOKEN_2, TOKEN_3, USER_1, USER_2, USER_3 } from '../test.data'
import SCHEMAS from '../../../../src/database/schemas'

describe('/participants', () => {

  beforeAll((done) => {
    LogConfig.off()
    connection.open(() => done())
  })

  beforeEach((done) => {
    resetDatabase()
      .then(() => Promise.allSettled([
        new SCHEMAS.ACCOUNTS.model(ACCOUNT_1).save(),
        new SCHEMAS.ACCOUNTS.model(ACCOUNT_2).save(),
        new SCHEMAS.ACCOUNTS.model(ACCOUNT_3).save(),
        new SCHEMAS.USERS.model(USER_1).save(),
        new SCHEMAS.USERS.model(USER_2).save(),
        new SCHEMAS.USERS.model(USER_3).save(),
        new SCHEMAS.SECTIONS.model(SECTION_1).save(),
        new SCHEMAS.SECTIONS.model(SECTION_2).save(),
        new SCHEMAS.SECTIONS.model(SECTION_3).save(),
        new SCHEMAS.MEMBERS.model(MEMBER_1).save(),
        new SCHEMAS.MEMBERS.model(MEMBER_2).save(),
        new SCHEMAS.MEMBERS.model(MEMBER_3).save(),
        new SCHEMAS.MEMBERS.model(MEMBER_4).save(),
        new SCHEMAS.SESSIONS.model(SESSION_1).save(),
        new SCHEMAS.SESSIONS.model(SESSION_2).save(),
        new SCHEMAS.SESSIONS.model(SESSION_3).save(),
        new SCHEMAS.PARTICIPANTS.model(PARTICIPANT_1).save(),
        new SCHEMAS.PARTICIPANTS.model(PARTICIPANT_2).save(),
        new SCHEMAS.PARTICIPANTS.model(PARTICIPANT_3).save(),
        new SCHEMAS.PARTICIPANTS.model(PARTICIPANT_4).save(),
      ]))
      .then(() => {
        done()
      })
  })

  afterAll((done) => {
    resetDatabase().then(() => connection.close(() => done()))
  })

  describe('POST', () => {

    test('When no token is provided', () => {
      return request(app)
        .post('/rest/participants')
        .send({
          sessionId: 'session2',
          userId: 'user1',
          status: 'ACCEPTED',
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
        })
    })

    test('When creating a participant on a session that does not exist', () => {
      return request(app)
        .post('/rest/participants')
        .set({ Authorization: TOKEN_1 })
        .send({
          sessionId: 'sessionDummy',
          userId: 'user1',
          status: 'ACCEPTED',
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          expect(response.body.error).toBe('SESSION_NOT_FOUND')
        })
    })

    test('When creating a participant on a user that does not exist', () => {
      return request(app)
        .post('/rest/participants')
        .set({ Authorization: TOKEN_1 })
        .send({
          sessionId: 'session1',
          userId: 'userDummy',
          status: 'ACCEPTED',
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          expect(response.body.error).toBe('USER_NOT_FOUND')
        })
    })

    test('When creating a participant on a user that is not member of the section', () => {
      return request(app)
        .post('/rest/participants')
        .set({ Authorization: TOKEN_1 })
        .send({
          sessionId: 'session3',
          userId: 'user3',
          status: 'ACCEPTED',
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          expect(response.body.error).toBe('MEMBER_NOT_FOUND')
        })
    })

    test('When user is not admin and creates participation for another user', () => {
      return request(app)
        .post('/rest/participants')
        .set({ Authorization: TOKEN_3 })
        .send({
          sessionId: 'session2',
          userId: 'user1',
          status: 'ACCEPTED',
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
        })
    })

    test('When user is session admin and creates participation for another user', () => {
      return request(app)
        .post('/rest/participants')
        .set({ Authorization: TOKEN_2 })
        .send({
          sessionId: 'session2',
          userId: 'user1',
          status: 'ACCEPTED',
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.CREATED)
        })
    })

    test('When user is admin and creates participation for another user', () => {
      return request(app)
        .post('/rest/participants')
        .set({ Authorization: TOKEN_1 })
        .send({
          sessionId: 'session1',
          userId: 'user3',
          status: 'ACCEPTED',
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.CREATED)
        })
    })

    test('When user creates participation for himself', () => {
      return request(app)
        .post('/rest/participants')
        .set({ Authorization: TOKEN_3 })
        .send({
          sessionId: 'session1',
          userId: 'user3',
          status: 'ACCEPTED',
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.CREATED)
        })
    })
  })

  describe('/:participantId', () => {

    describe('GET', () => {

      test('When no token is provided', () => {
        return request(app)
          .get(`/rest/participants/${PARTICIPANT_1.id}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
          })
      })

      test('When accessing a participant that does not exist', () => {
        return request(app)
          .get('/rest/participants/dummy')
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            expect(response.body.error).toBe('PARTICIPANT_NOT_FOUND')
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
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
            })
        })

        test('When accessing a participant that does not exist', () => {
          return request(app)
            .put('/rest/participants/dummy/status')
            .set({ Authorization: TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
              expect(response.body.error).toBe('PARTICIPANT_NOT_FOUND')
            })
        })

        test('When sending no status', () => {
          return request(app)
            .put(`/rest/participants/${PARTICIPANT_1.id}/status`)
            .set({ Authorization: TOKEN_1 })
            .send()
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

        test('When user is not admin and updates status for another user', () => {
          return request(app)
            .put(`/rest/participants/${PARTICIPANT_1.id}/status`)
            .set({ Authorization: TOKEN_3 })
            .send({ status: 'ACCEPTED' })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
            })
        })

        test('When user is section admin and updates status for another user', () => {
          return request(app)
            .put(`/rest/participants/${PARTICIPANT_4.id}/status`)
            .set({ Authorization: TOKEN_2 })
            .send({ status: 'ACCEPTED' })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
            })
        })

        test('When user is admin and updates status for another user', () => {
          return request(app)
            .put(`/rest/participants/${PARTICIPANT_4.id}/status`)
            .set({ Authorization: TOKEN_1 })
            .send({ status: 'ACCEPTED' })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
            })
        })

        test('When user updates status for himself', () => {
          return request(app)
            .put(`/rest/participants/${PARTICIPANT_4.id}/status`)
            .set({ Authorization: TOKEN_3 })
            .send({ status: 'DECLINED' })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
            })
        })
      })
    })
  })
});