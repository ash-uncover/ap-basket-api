import request from 'supertest'

import { LogConfig } from '@uncover/js-utils-logger'
import { HttpUtils } from '@uncover/js-utils'

import app from '../../../../src/rest'
import connection from '../../../../src/database/connection'
import { ACCOUNT_1, ACCOUNT_2, ACCOUNT_3, MEMBER_1, MEMBER_2, MEMBER_3, MEMBER_4, PARTICIPANT_1, PARTICIPANT_2, PARTICIPANT_3, PARTICIPANT_4, resetDatabase, SECTION_1, SECTION_2, SECTION_3, SESSION_1, SESSION_2, SESSION_3, TOKEN_1, TOKEN_2, TOKEN_3, USER_1, USER_2, USER_3 } from '../test.data'
import SCHEMAS from '../../../../src/database/schemas'

describe('/sessions', () => {

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
        .post('/rest/sessions')
        .send({
          sectionId: 'section1',
          maxParticipants: 10,
          date: new Date(),
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
        })
    })

    test('When creating a session on a section that does not exist', () => {
      return request(app)
        .post('/rest/sessions')
        .set({ Authorization: TOKEN_1 })
        .send({
          sectionId: 'sectionDummy',
          maxParticipants: 10,
          date: new Date(),
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
          expect(response.body.error).toBe('SECTION_NOT_FOUND')
        })
    })

    test('When creating a session with a user that is not admin of the section', () => {
      return request(app)
        .post('/rest/sessions')
        .set({ Authorization: TOKEN_2 })
        .send({
          sectionId: 'section1',
          maxParticipants: 10,
          date: new Date(),
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
        })
    })

    test('When user is section admin', () => {
      return request(app)
        .post('/rest/sessions')
        .set({ Authorization: TOKEN_2 })
        .send({
          sectionId: 'section2',
          maxParticipants: 10,
          date: new Date(),
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.CREATED)
        })
    })

    test('When user is admin and creates session for another section he does not belong to', () => {
      return request(app)
        .post('/rest/sessions')
        .set({ Authorization: TOKEN_1 })
        .send({
          sectionId: 'section3',
          maxParticipants: 10,
          date: new Date(),
        })
        .then(response => {
          expect(response.statusCode).toBe(HttpUtils.HttpStatus.CREATED)
        })
    })
  })

  describe('/:sessionId', () => {

    describe('GET', () => {

      test('When no token is provided', () => {
        return request(app)
          .get(`/rest/sessions/${SESSION_1.id}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
          })
      })

      test('When accessing a session that does not exist', () => {
        return request(app)
          .get('/rest/sessions/dummy')
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            expect(response.body.error).toBe('SESSION_NOT_FOUND')
          })
      })

      test('When a valid token is provided', () => {
        return request(app)
          .get(`/rest/sessions/${SESSION_1.id}`)
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
          })
      })
    })


    describe('PUT', () => {

      test('When no token is provided', () => {
        return request(app)
          .put(`/rest/sessions/${SESSION_1.id}`)
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
          })
      })

      test('When accessing a session that does not exist', () => {
        return request(app)
          .put('/rest/sessions/dummy')
          .set({ Authorization: TOKEN_1 })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            expect(response.body.error).toBe('SESSION_NOT_FOUND')
          })
      })

      test('When sending invalid data', () => {
        return request(app)
          .put(`/rest/sessions/${SESSION_1.id}`)
          .set({ Authorization: TOKEN_1 })
          .send({
            maxParticipants: 'test',
            date: 2,
            status: 'ACCEPTED'
          })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.BAD_REQUEST)
          })
      })

      test('When sending invalid status', () => {
        return request(app)
          .put(`/rest/sessions/${SESSION_1.id}`)
          .set({ Authorization: TOKEN_1 })
          .send({
            maxParticipants: 2,
            date: 'test',
            status: 'ACCEPTED'
          })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.BAD_REQUEST)
          })
      })

      test('When user is not section admin and updates a session', () => {
        return request(app)
          .put(`/rest/sessions/${SESSION_1.id}`)
          .set({ Authorization: TOKEN_3 })
          .send({
            maxParticipants: 2,
            date: new Date(),
            status: 'ACCEPTED'
          })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.FORBIDDEN)
          })
      })

      test('When user is section admin and updates a session', () => {
        return request(app)
          .put(`/rest/sessions/${SESSION_2.id}`)
          .set({ Authorization: TOKEN_2 })
          .send({
            maxParticipants: 2,
            date: new Date(),
            status: 'ACCEPTED'
          })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
          })
      })

      test('When user is admin and updates a session from another section', () => {
        return request(app)
          .put(`/rest/sessions/${SESSION_2.id}`)
          .set({ Authorization: TOKEN_1 })
          .send({
            maxParticipants: 2,
            date: new Date(),
            status: 'ACCEPTED'
          })
          .then(response => {
            expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
          })
      })
    })

    describe('/participants', () => {

      describe('GET', () => {

        test('When no token is provided', () => {
          return request(app)
            .get(`/rest/sessions/${SESSION_1.id}/participants`)
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.UNAUTHORIZED)
            })
        })

        test('When accessing a session that does not exist', () => {
          return request(app)
            .get('/rest/sessions/dummy/participants')
            .set({ Authorization: TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.NOT_FOUND)
            })
        })

        test('When the call is valid', () => {
          return request(app)
            .get(`/rest/sessions/${SESSION_1.id}/participants`)
            .set({ Authorization: TOKEN_1 })
            .then(response => {
              expect(response.statusCode).toBe(HttpUtils.HttpStatus.OK)
            })
        })
      })
    })
  })
});