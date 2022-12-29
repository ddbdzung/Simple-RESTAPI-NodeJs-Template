import httpStatus from 'http-status'

import { tokenService, userService } from '../services/index.mjs'
import { status as STATUS } from '../constants/index.mjs'
import ApiError from '../helpers/ApiError.mjs'

export const verifyUser = (...requiredRights) => async (req, _res, next) => {
  const authHeader = req.headers?.authorization
  try {
    if (!authHeader) {
      throw new ApiError(httpStatus.BAD_REQUEST, httpStatus[400])
    }

    // Detach token from authHeader
    const token = authHeader.split(' ')[1]
    const { role, status, sub: id } = tokenService.verifyToken(token, 'access')

    if (status === STATUS.BANNED) {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403])
    }

    const user = await userService.getUserById(id)
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    if (role !== user.role) {
      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    if (requiredRights.length) {
      const requiredRightsClean = requiredRights.flat()
      const { rolePermissions } = await user.rolePopulating('permission')
      const { permission: userRights } = rolePermissions[0]
      // eslint-disable-next-line max-len
      const hasRequiredRights = requiredRightsClean.every(requiredRight => userRights.includes(requiredRight))

      if (!hasRequiredRights) {
        throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
      }

      // Validate only user can update their own data
      const userId = req.params?.userId
      if (userId && userId !== req.user._id.toString()) {
        throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
      }
    }

    const { _doc } = user
    req.user = _doc
    next()
  } catch (err) {
    next(err)
  }
}
