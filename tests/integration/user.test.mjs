/* eslint-disable */
import request from 'supertest'
import { faker } from '@faker-js/faker/locale/vi'

import app from '../../app.mjs'
import setupTestDB from '../helpers/connectDb.mjs'
import { insertUsers } from '../fixtures/user.fixture.mjs'
import { api, status } from '../../src/constants/index.mjs'
import { tokenService, userService } from '../../src/services/index.mjs'
import { User } from '../../src/models/user.model.mjs'
const { ENDPOINTS, V1 } = api
const {
  VALIDATE_EMAIL,
  BASE,
} = ENDPOINTS.USER

setupTestDB()
describe('User routes', () => {

  // * send validate email
  // Test validate email API
  describe(`POST ${V1}/${BASE}/${VALIDATE_EMAIL} .sendValidationEmail`, () => {

    let inactiveUser
    beforeEach(async () => {
      const { role, status } = await import('../../src/constants/index.mjs')
      inactiveUser = {
        fullname: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.INACTIVE,
      }
      await insertUsers([inactiveUser])
    })

    it('should return 200 if email sent', async () => {
      const user = await userService.getUserByEmail(inactiveUser.email)
      const { access: { token } } = tokenService.generateAuthTokens(user)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${VALIDATE_EMAIL}`)
          .set({ 'Authorization': `Bearer ${token}` })

      expect(res.statusCode).toBe(200)
    })

    it('should return 200 if email already exist in mailbox', async () => {
      const user = await userService.getUserByEmail(inactiveUser.email)
      const { access: { token } } = tokenService.generateAuthTokens(user)

      await
        request(app)
          .post(`${V1}/${BASE}/${VALIDATE_EMAIL}`)
          .set({ 'Authorization': `Bearer ${token}` })
          .then(async (_res) => {
            await
              request(app)
                .post(`${V1}/${BASE}/${VALIDATE_EMAIL}`)
                .set({ 'Authorization': `Bearer ${token}` })
                .then(async (nextRes) => {
                  expect(nextRes.statusCode).toBe(200)
                })
          })
    })

    // // TODO Solve problem: how to fast-forward to 5 minutes later to test expired token in calling API
    // // it('should return 201 when send new email after 5 minutes expired token', async () => {
    // //
    // // })

    it('should return 403 if user is already active', async () => {
      const user = await User.findOneAndUpdate({ email: inactiveUser.email }, { status: status.ACTIVE }, { new: true })
      const { access: { token } } = tokenService.generateAuthTokens(user)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${VALIDATE_EMAIL}`)
          .set({ 'Authorization': `Bearer ${token}` })

      expect(res.statusCode).toBe(403)
    })

    it('should return 403 if user is already active', async () => {
      const user = await User.findOneAndUpdate({ email: inactiveUser.email }, { status: status.BANNED }, { new: true })
      const { access: { token } } = tokenService.generateAuthTokens(user)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${VALIDATE_EMAIL}`)
          .set({ 'Authorization': `Bearer ${token}` })

      expect(res.statusCode).toBe(403)
    })
  })
  // * confirm account
  // Test confirm account API
  describe(`POST ${V1}/${BASE}/${VALIDATE_EMAIL}/t=:token .confirmAccount`, () => {
    let inactiveUser
    let user
    let activateToken

    beforeEach(async () => {
      const { role, status } = await import('../../src/constants/index.mjs')
      inactiveUser = {
        fullname: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.INACTIVE,
      }
      user = await User.create(inactiveUser)

      activateToken = tokenService.generateValAccToken(user._id)
      user.activateToken = activateToken
      await user.save()
    })

    afterEach(async () => {
      user.activateToken = undefined
      await user.save()
    })

    it('should return 200 if status of user is inactive, token existed and valid', async () => {
      const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=${activateToken}`)
      expect(res.statusCode).toBe(200)
    })

    // TODO fast-forward time until token expired to test API
    // it('should return 401 if token is expired', async () => {
    //   const res = await request(app).get(`/api/v1/auth/${VALIDATE_EMAIL}/t=${activateToken}`)
    // })

    it('should return 401 if token is malformed', async () => {
      const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=malformed_token`)
      expect(res.statusCode).toBe(401)
    })

    it('should return 403 if token not exists', async () => {
      user.activateToken = undefined
      await user.save()
      const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=${activateToken}`)
      expect(res.statusCode).toBe(403)
    })

    it('should return 403 if status user is active', async () => {
      user.status = status.ACTIVE
      await user.save()
      const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=${activateToken}`)
      expect(res.statusCode).toBe(403)
    })

    it('should return 403 if status user is banned', async () => {
      user.status = status.BANNED
      await user.save()
      const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=${activateToken}`)
      expect(res.statusCode).toBe(403)
    })

    it('should return 404 if token is not provided in URL', async () => {
      const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=`)
      expect(res.statusCode).toBe(404)
    })

  })

})
