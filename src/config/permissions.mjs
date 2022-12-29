export const permissions = {
  USER: {
    CREATE_USER: 'create_user', // Admin right
    READ_USER: 'read_user', // User & Admin right
    READ_USERS: 'read_users', // Admin right
    UPDATE_USER: 'update_user', // User & Admin right
    UPDATE_USERS: 'update_users', // Admin right
    DELETE_USER: 'delete_user', // Admin right
  },
  PRODUCT: {
    GET_PRODUCTS: 'get_products', // Admin right
    GET_PRODUCT: 'get_product', // User & Admin right
    CREATE_PRODUCT: 'create_product', // Admin right
    UPDATE_PRODUCT: 'update_product', // Admin right
    UPDATE_PRODUCTS: 'update_products', // Admin right
    DELETE_PRODUCT: 'delete_product', // Admin right
    DELETE_PRODUCTS: 'delete_products', // Admin right
  },
  ORDER: {
    GET_ORDERS: 'get_orders', // Admin right
    GET_ORDER: 'get_order', // User & Admin right
    CREATE_ORDER: 'create_order', // Admin right
    UPDATE_ORDER: 'update_order', // Admin right
    UPDATE_ORDERS: 'update_orders', // Admin right
    DELETE_ORDER: 'delete_order', // Admin right
    DELETE_ORDERS: 'delete_orders', // Admin right
  },
  TRANSACTION: {
    GET_TRANSACTIONS: 'get_transactions', // Admin right
    GET_TRANSACTION: 'get_transaction', // User & Admin right
    CREATE_TRANSACTION: 'create_transaction', // Admin right
    UPDATE_TRANSACTION: 'update_transaction', // Admin right
    UPDATE_TRANSACTIONS: 'update_transactions', // Admin right
  },
  BRAND: {
    GET_BRAND: 'get_brand', // Admin right
    GET_BRANDS: 'get_brands', // Admin right
    CREATE_BRAND: 'create_brand', // Admin right
    UPDATE_BRAND: 'update_brand', // Admin right
    UPDATE_BRANDS: 'update_brands', // Admin right
    DELETE_BRAND: 'delete_brand', // Admin right
    DELETE_BRANDS: 'delete_brands', // Admin right
  },
  CATALOG: {
    GET_CATALOG: 'get_catalog', // Admin right
    GET_CATALOGS: 'get_catalogs', // Admin right
    CREATE_CATALOG: 'create_catalog', // Admin right
    UPDATE_CATALOG: 'update_catalog', // Admin right
    UPDATE_CATALOGS: 'update_catalogs', // Admin right
    DELETE_CATALOG: 'delete_catalog', // Admin right
    DELETE_CATALOGS: 'delete_catalogs', // Admin right
  },
}

export const permissionArray = Object.values(permissions).reduce((prev, curr) => {
  if (typeof curr !== 'object') {
    throw new Error('Permission must be an object')
  }

  return [...Object.values(prev), ...Object.values(curr)]
}, [])
