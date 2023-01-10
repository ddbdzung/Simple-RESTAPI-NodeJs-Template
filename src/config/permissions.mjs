export const permissions = {
  USER: {
    CREATE_USER: 'create_user', // User & Admin right
    READ_USER: 'read_user', // User & Admin right
    READ_USERS: 'read_users', // Admin right
    UPDATE_USER: 'update_user', // User & Admin right
    UPDATE_USERS: 'update_users', // Admin right
    DELETE_USER: 'delete_user', // Admin right
    DELETE_USERS: 'delete_users', // Admin right
  },
}

export const permissionArray = Object.values(permissions).reduce((prev, curr) => {
  if (typeof curr !== 'object') {
    throw new Error('Permission must be an object')
  }

  return [...Object.values(prev), ...Object.values(curr)]
}, [])
