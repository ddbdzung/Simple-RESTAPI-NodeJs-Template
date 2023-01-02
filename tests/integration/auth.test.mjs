/* eslint-disable */
import request from 'supertest'
import slugify from 'slugify'
import { faker } from '@faker-js/faker/locale/vi'
import Jwt from 'jsonwebtoken'

import app from '../../app.mjs'
import setupTestDB from '../helpers/connectDb.mjs'
import { User } from '../../src/models/user.model.mjs'
import { insertUsers, userOne } from '../fixtures/user.fixture.mjs'
import { api, status, expireOTP, role } from '../../src/constants/index.mjs'
import { tokenService, userService } from '../../src/services/index.mjs'
import { config } from '../../src/validations/index.mjs'
import { stringToDate } from '../../src/common/toDate.mjs'
import { Token } from '../../src/models/token.model.mjs'


const { ENDPOINTS, V1 } = api
const {
  REGISTER,
  LOGIN,
  BASE,
  FIND_ACCOUNT,
  RESETPW_EMAIL,
  VALIDATE_PWCODE,
  RESET_PASSWORD,
  REFRESH_TOKEN,
  LOGOUT,
} = ENDPOINTS.AUTH

setupTestDB()

describe('Auth routes', () => {
  // * register
  // Test register API
  describe(`POST ${V1}/${BASE}/${REGISTER} .register`, () => {
    let newUser
    let sluggedUsername
    beforeEach(() => {
      newUser = {
        fullname: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'babysocute02',
      }
      sluggedUsername = slugify(newUser.fullname, { lower: true })
    })

    it('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post(`${V1}/${BASE}/${REGISTER}`).send(newUser)
      expect(res.statusCode).toBe(201)
      expect(res.body.data.user).not.toHaveProperty('password')
      expect(res.body.data.user).toEqual({
        id: expect.anything(),
        fullname: newUser.fullname,
        email: newUser.email,
        role: 'user',
        slug: sluggedUsername,
        status: 'inactive',
      })
      const dbNewUser = await User.findById({ _id: res.body.data.user.id })
      expect(dbNewUser).toBeDefined()
      expect(dbNewUser.password).not.toBe(newUser.password)
      expect(dbNewUser).toMatchObject({
        fullname: newUser.fullname,
        email: newUser.email,
        role: 'user',
        status: 'inactive',
        slug: sluggedUsername,
      })
      expect(res.body.data.tokens).toEqual({
        access: {
          token: expect.anything(),
          expiresAt: expect.anything(),
        },
        refresh: {
          token: expect.anything(),
          expiresAt: expect.anything(),
        },
      })
    })

    it('should return 400 bad request if not contains email, password, username', async () => {
      const res1 = await request(app).post(`${V1}/${BASE}/${REGISTER}`)
      expect(res1.statusCode).toBe(400)
    })

    it('should return 400 error if email is invalid', async () => {
      newUser.email = 'invalidEmail'
      const res = await request(app).post(`${V1}/${BASE}/${REGISTER}`).send(newUser)
      expect(res.statusCode).toBe(400)
    })

    it('should return 400 error if email is already existed', async () => {
      await insertUsers([userOne])
      newUser.email = userOne.email
      const res = await request(app).post(`${V1}/${BASE}/${REGISTER}`).send(newUser)
      expect(res.statusCode).toBe(400)
    })
  })
  // * log in
  // Test log-in API
  describe(`POST ${V1}/${BASE}/${LOGIN} .login`, () => {
    it('should return 200 and successfully validate user info', async () => {
      await insertUsers([userOne])
      // Login form with verified info
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      }
      const res = await request(app).post(`${V1}/${BASE}/${LOGIN}`).send(loginCredentials)
      expect(res.statusCode).toBe(200)
      expect(res.body.data.user).toEqual({
        id: expect.anything(),
        fullname: userOne.fullname,
        email: userOne.email,
        role: userOne.role,
        slug: userOne.slug,
        status: userOne.status,
      })
      expect(res.body.data.tokens).toEqual({
        access: {
          token: expect.anything(),
          expiresAt: expect.anything(),
        },
        refresh: {
          token: expect.anything(),
          expiresAt: expect.anything(),
        }
      })
    })

    it('should return 400 bad request that email required and password required', async () => {
      const res = await request(app).post(`${V1}/${BASE}/${LOGIN}`).send({
        email: '',
        password: '',
      })
      expect(res.body.code).toBe(400)
    })

    it('should return 401 if there are no users with that email', async () => {
      const res = await request(app).post(`${V1}/${BASE}/${LOGIN}`).send({
        email: 'wrong email',
        password: userOne.password,
      })
      expect(res.body.code).toBe(401)
    })

    it('should return 401 error if password is wrong', async () => {
      const res = await request(app).post(`${V1}/${BASE}/${LOGIN}`).send({
        email: userOne.email,
        password: 'wrong password',
      })
      expect(res.body.code).toBe(401)
    })

  })
  // * find account
  // Test find account API
  describe(`POST ${V1}/${BASE}/${FIND_ACCOUNT} .findAccount`, () => {
    // Arrange
    let activeUser
    let user
    beforeEach(async () => {
      const { role, status } = await import('../../src/constants/index.mjs')
      activeUser = {
        fullname: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.ACTIVE,
      }
      user = await User.create(activeUser)
    })
    it('should return 200 with resetpw-mail token', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`).send({ email: activeUser.email })
      const token = res.body.data?.token
      const { sub } = Jwt.verify(token, config.defaultTokenKey)
      const { findAccountToken } = await userService.getUserById(sub)

      // Assert
      expect(res.statusCode).toBe(200)
      expect(token).toBeDefined()
      expect(findAccountToken).toEqual(token)
    })

    it('should return 400 if email not pass into request', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`)

      // Assert
      expect(res.statusCode).toBe(400)
    })

    it('should return 401 if email not exist', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`).send({ email: 'fake@example.com' })

      // Assert
      expect(res.statusCode).toBe(401)
    })

    it('should return 401 if email exists but account is inactive', async () => {
      // Act
      user.status = status.INACTIVE
      await user.save()
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`).send({ email: user.email })

      // Assert
      expect(res.statusCode).toBe(401)
    })
  })
  // * send reset pw email
  // Test reset password send email API
  describe(`POST ${V1}/${BASE}/${RESETPW_EMAIL} .checkResetPwCode`, () => {
    // Arrange
    let activeUser
    let user
    const option = 'byEmail'
    beforeEach(async () => {
      activeUser = {
        fullname: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.ACTIVE,
      }
      user = await User.create(activeUser)
    })

    afterEach(async () => {
      user.findAccountToken = undefined
      await user.save()
    })

    it('should return 200 if successfully send email or resend email', async () => {
      const token = tokenService.generateToken({ sub: user._id }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins
      user.findAccountToken = token
      await user.save()
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token, option })
      const { resetPwCode, resetPwIssued } = await userService.getUserById(user._id)
      const clientToken = res.body.data?.token

      // Assert
      expect(res.statusCode).toBe(200)
      expect(clientToken).toBeDefined()
      expect(resetPwCode).toHaveLength(6)
      expect(resetPwIssued).toBeDefined()
      expect(Date.now() - stringToDate(resetPwIssued)).toBeGreaterThan(0) // reset pw code must be valid (have not expired) 
      expect(Date.now() - stringToDate(resetPwIssued)).toBeLessThanOrEqual(expireOTP) // reset pw code must be valid (not greater than expires time) 
    })

    it('should return 400 if token not found', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`)

      // Assert
      expect(res.statusCode).toBe(400)
    })

    it('should return 401 if token not exist', async () => {
      const token = tokenService.generateToken({ sub: user._id }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token, option })

      expect(res.statusCode).toBe(401)
    })

    it('should return 401 if token invalid (malformed)', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token: 'invalid token', option })

      expect(res.statusCode).toBe(401)
    })

    // TODO fast-forward token to expired
    // it('should return 401 if token invalid (expired or invalid signed)', async () => {
    //   const token = tokenService.generateToken({ sub: user._id }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins

    //   // Act
    //   const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token: 'invalid token'})

    //   expect(res.statusCode).toBe(401)
    // })

    it('should return 401 if user not exist', async () => {
      const randomId = '62f067b1a405b5affaf39694'
      const token = tokenService.generateToken({ sub: randomId }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token, option })

      // Assert
      expect(res.statusCode).toBe(401)
    })
  })
  // * validate pw code
  // Test validate password code API
  describe(`POST ${V1}/${BASE}/${VALIDATE_PWCODE} .checkResetPwCode`, () => {
    // Arrange
    let activeUser
    let user
    let secureCode = '999999'
    let token
    beforeEach(async () => {
      const { role, status } = await import('../../src/constants/index.mjs')
      activeUser = {
        fullname: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.ACTIVE,
        resetPwCode: secureCode,
        resetPwIssued: Date.now().toString(),
      }
      user = await User.create(activeUser)
      token = tokenService.generateToken({ sub: user._id }, config.clientRPTokenKey, { expiresIn: 30 * 60 })
    })
    it('should return 200 with secure token to reset password', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ secureCode, token })
      const secureToken = res.body?.data?.token
      const { sub } = tokenService.verifyToken(secureToken, 'secure')
      const updatedUser = await userService.getUserById(sub)
      // Assert
      expect(res.statusCode).toBe(200)
      expect(secureToken).toBeDefined()
      expect(updatedUser?.resetPwToken).toBeDefined()
      expect(updatedUser.resetPwRate).toEqual(0)
      expect(updatedUser?.resetPwCode).toBeUndefined()
      expect(updatedUser?.resetPwIssued).toBeUndefined()
    })
    it('should return 400 if token or/and secure code not found', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`)

      // Assert
      expect(res.statusCode).toBe(400)
    })

    it('should return 400 if secure code malformed "exactly 6 character"', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode: '12345' })

      // Assert
      expect(res.statusCode).toBe(400)
    })

    it('should return 401 if token invalid: malformed', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token: 'asdzxds', secureCode })

      // Assert
      expect(res.statusCode).toBe(401)
    })

    it('should return 401 if token invalid: expired', async () => {
      // Arrange
      const expiredToken = await Promise.resolve(tokenService.generateToken({ sub: user._id }, config.clientRPTokenKey, { expiresIn: 0 }))

      // Act
      const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token: expiredToken, secureCode })

      // Assert
      expect(res.statusCode).toBe(401)
    })

    it('should return 401 if token invalid: user not found', async () => {
      // Arrange
      const notExistId = '5ebac534954b54139806c112'
      const invalidToken = tokenService.generateToken({ sub: notExistId }, config.clientRPTokenKey, { expiresIn: 30 * 60 })

      // Act
      const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token: invalidToken, secureCode })

      // Assert
      expect(res.statusCode).toBe(401)
    })

    it('should return 401 if wrong code', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode: '100000' })

      // Assert
      expect(res.statusCode).toBe(401)
    })

    it('should return 403 if user bypass API and try to re-bypass API when resetpw code undefined', async () => {
      // ! 1
      await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode })
        .then(async res => {
          // ! 2
          expect(res.statusCode).toBe(200)
          await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode })
            .then(async res => {
              const { resetPwRate } = await userService.getUserById(user._id)

              expect(resetPwRate).toEqual(0)
              expect(res.statusCode).toBe(403)
            })
        })
    })

    it('should return 403 if request reachs rate limit', async () => {
      // ! 1
      await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode: '123456' })
        .then(async res => {
          expect(res.statusCode).toBe(401)
          // ! 2
          await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode: '123456' })
            .then(async res => {
              expect(res.statusCode).toBe(401)
              // ! 3
              await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode: '123456' })
                .then(async res => {
                  expect(res.statusCode).toBe(401)
                  // ! 4
                  await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode: '123456' })
                    .then(async res => {
                      expect(res.statusCode).toBe(401)
                      // ! 5
                      await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode: '123456' })
                        .then(async res => {
                          expect(res.statusCode).toBe(401)
                          // ! 6
                          // * With correct secure code and token but reach limit request 
                          await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode, })
                            .then(async res => {
                              const { resetPwRate } = await userService.getUserById(user._id)

                              expect(res.statusCode).toBe(403)
                              expect(resetPwRate).toEqual(5)
                            })
                        })
                    })
                })
            })
        })
    })

    // TODO fast-forward time to expired secure code
    // it('should return 401 if code expired', async () => {
    //   // Act
    //   const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_PWCODE}`).send({ token, secureCode })

    //   // Assert
    //   expect(res.statusCode).toBe(401)
    //   expect(Date.now() - stringToDate(resetPwIssued)).toBeGreaterThanOrEqual(expireOTP)
    // })
  })
  // * reset password 
  // Test reset password API
  describe(`POST ${V1}/${BASE}/${RESET_PASSWORD} .resetPassword`, () => {
    // Arrange
    let activeUser
    let user
    let token
    let resetPassword
    beforeEach(async () => {
      activeUser = {
        fullname: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.ACTIVE,
      }
      resetPassword = 'newpassword123!'
      user = await User.create(activeUser)
      token = tokenService.generateToken({ sub: user._id }, config.secureTokenKey, { expiresIn: 30 * 60 })
      user.resetPwToken = token
      await user.save()
    })

    it('should return 200 if user reset password successfully', async () => {
      const res = await request(app).post(`${V1}/${BASE}/${RESET_PASSWORD}`).send({ token, resetPassword })
      const updatedUser = await userService.getUserById(user._id)

      expect(res.statusCode).toBe(200)
      expect(updatedUser?.resetPwToken).toBeUndefined()
      expect(userService.hashPassword(resetPassword)).not.toEqual(user.password)
    })

    it('should return 400 if token not found', async () => {
      const res = await request(app).post(`${V1}/${BASE}/${RESET_PASSWORD}`).send({ resetPassword })
      const updatedUser = await userService.getUserById(user._id)

      expect(res.statusCode).toBe(400)
      expect(updatedUser?.resetPwToken).toBeDefined()
    })

    it('should return 400 if reset password not found', async () => {
      const res = await request(app).post(`${V1}/${BASE}/${RESET_PASSWORD}`).send({ token })
      const updatedUser = await userService.getUserById(user._id)

      expect(res.statusCode).toBe(400)
      expect(updatedUser?.resetPwToken).toBeDefined()
    })

    it('should return 401 if user not exist', async () => {
      const nonExistId = '5ebac534954b54139806c112'
      // Expires in 60 mins
      const fakeToken = tokenService.generateToken({ sub: nonExistId }, config.secureTokenKey, { expiresIn: 30 * 60 })
      const res = await request(app).post(`${V1}/${BASE}/${RESET_PASSWORD}`).send({ token: fakeToken, resetPassword })
      const updatedUser = await userService.getUserById(user._id)

      expect(res.statusCode).toBe(401)
      expect(updatedUser?.resetPwToken).toBeDefined()
    })

    it('should return 401 if token invalid: malformed', async () => {
      const res = await request(app).post(`${V1}/${BASE}/${RESET_PASSWORD}`).send({ token: 'malformed', resetPassword })
      const updatedUser = await userService.getUserById(user._id)

      expect(res.statusCode).toBe(401)
      expect(updatedUser?.resetPwToken).toBeDefined()
    })

    it('should return 401 if token not exist', async () => {
      const nonExistToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8'
      const res = await request(app).post(`${V1}/${BASE}/${RESET_PASSWORD}`).send({ token: nonExistToken, resetPassword })
      const updatedUser = await userService.getUserById(user._id)

      expect(res.statusCode).toBe(401)
      expect(updatedUser?.resetPwToken).toBeDefined()
    })

    // TODO fast-forward to check expired token
    // it('should return 401 if token invalid: expired', async () => {
    //   const res = await request(app).post(`${V1}/${BASE}/${RESET_PASSWORD}`).send({ token, resetPassword })
    //   const updatedUser = await userService.getUserById(user._id)

    //   expect(res.statusCode).toBe(401)
    //   expect(updatedUser?.resetPwToken).toBeDefined()
    // })

  })
  // * Refresh token 
  // Test refresh token API
  describe(`POST ${V1}/${BASE}/${REFRESH_TOKEN} .refreshToken`, () => {
    // Arrange
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
    it('should return 201 with new access token and new refresh token', async () => {
      const user = await userService.getUserByEmail(inactiveUser.email)
      const tokens = tokenService.generateAuthTokens(user)
      await tokenService.createSessionUser(tokens.refresh.token, user._id)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${REFRESH_TOKEN}`)
          .set({ 'Authorization': `Bearer ${tokens.access.token}` })
          .send({ refresh: tokens.refresh.token })

      const { token: AT, expiresAt: ATexpires } = res.body.data.access
      const { token: RT, expiresAt: RTexpires } = res.body.data.refresh
      const { user: { id: userId } } = await tokenService.getSessionByToken(RT)

      expect(res.statusCode).toBe(201)
      expect(AT).toBeDefined()
      expect(RT).toBeDefined()
      expect(ATexpires).toBeGreaterThan(Date.now() / 1000)
      expect(RTexpires).toBeGreaterThan(Date.now() / 1000)
      expect(userId.toString()).toStrictEqual(user._id.toString())
    })

    it('should return 400 if user do not provide RT', async () => {
      const user = await userService.getUserByEmail(inactiveUser.email)
      const tokens = tokenService.generateAuthTokens(user)
      await tokenService.createSessionUser(tokens.refresh.token, user._id)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${REFRESH_TOKEN}`)
          .set({ 'Authorization': `Bearer ${tokens.access.token}` })

      expect(res.statusCode).toBe(400)
    })

    it('should return 401 if user is blackisted', async () => {
      const user = await userService.getUserByEmail(inactiveUser.email)
      const tokens = tokenService.generateAuthTokens(user)
      await tokenService.createSessionUser(tokens.refresh.token, user._id)
      const session = await tokenService.getSessionByToken(tokens.refresh.token)
      session.isBlacklisted = true
      await session.save()

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${REFRESH_TOKEN}`)
          .set({ 'Authorization': `Bearer ${tokens.access.token}` })
          .send({ refresh: tokens.refresh.token })

      expect(res.statusCode).toBe(401)
    })

  })
  // * Log out token 
  // Test log out API
  describe(`POST ${V1}/${BASE}/${LOGOUT} .logout`, () => {
    // Arrange
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

    it('should return 200 when log out session successfully', async () => {
      const user = await userService.getUserByEmail(inactiveUser.email)
      const tokens = tokenService.generateAuthTokens(user)
      await tokenService.createSessionUser(tokens.refresh.token, user._id)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${LOGOUT}`)
          .set({ 'Authorization': `Bearer ${tokens.access.token}` })
          .send({ refresh: tokens.refresh.token })

      const session = await Token.findOne({ token: tokens.refresh.token })

      expect(res.statusCode).toBe(200)
      expect(session).toBeNull()
    })

    it('should return 400 if user do not provide RT', async () => {
      const user = await userService.getUserByEmail(inactiveUser.email)
      const tokens = tokenService.generateAuthTokens(user)
      await tokenService.createSessionUser(tokens.refresh.token, user._id)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${LOGOUT}`)
          .set({ 'Authorization': `Bearer ${tokens.access.token}` })

      expect(res.statusCode).toBe(400)
    })

    it('should return 400 if user do not provide AT in header', async () => {
      const user = await userService.getUserByEmail(inactiveUser.email)
      const tokens = tokenService.generateAuthTokens(user)
      await tokenService.createSessionUser(tokens.refresh.token, user._id)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${LOGOUT}`)
          .send({ refresh: tokens.refresh.token })

      expect(res.statusCode).toBe(400)
    })

    it('should return 400 if user provides fake AT in header', async () => {
      const fakeAT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwiaWF0IjoxNjcyNjg1MDU3LCJleHAiOjE2NzI2ODUzNTd9.p56A1szy6MTc457z6ftpsmiGZiLuaNOcf6o6vphGvco'
      const user = await userService.getUserByEmail(inactiveUser.email)
      const tokens = tokenService.generateAuthTokens(user)
      await tokenService.createSessionUser(tokens.refresh.token, user._id)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${LOGOUT}`)
          .set({ 'Authorization': `Bearer ${fakeAT}` })
          .send({ refresh: tokens.refresh.token })

      expect(res.statusCode).toBe(400)
    })

    it('should return 400 if user provides fake AT (user not exist) in header', async () => {
      const fakeAT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjNiMzE3ZWUyYjI5MGUxZmU3YjQ3YzAwIiwiaWF0IjoxNjcyNjg1MDU3LCJleHAiOjE2NzI2ODUzNTd9.ZzEaJ3VTCaDoBgTNk3GEdm246aioKIDtm4FqVjp6jqA'
      const user = await userService.getUserByEmail(inactiveUser.email)
      const tokens = tokenService.generateAuthTokens(user)
      await tokenService.createSessionUser(tokens.refresh.token, user._id)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${LOGOUT}`)
          .set({ 'Authorization': `Bearer ${fakeAT}` })
          .send({ refresh: tokens.refresh.token })

      expect(res.statusCode).toBe(400)
    })

    it('should return 404 if refresh token not found in DB', async () => {
      const user = await userService.getUserByEmail(inactiveUser.email)
      const tokens = tokenService.generateAuthTokens(user)
      await tokenService.createSessionUser(tokens.refresh.token, user._id)

      const res = await
        request(app)
          .post(`${V1}/${BASE}/${LOGOUT}`)
          .set({ 'Authorization': `Bearer ${tokens.access.token}` })
          .send({ refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8' })

      expect(res.statusCode).toBe(404)
    })
  })
})
