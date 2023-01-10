import Joi from 'joi'

if (process.env.NODE_ENV !== 'production' || process.env?.IS_LOCAL_PROD) {
  const { config } = await import('dotenv')
  const { join, dirname } = await import('path')
  const { fileURLToPath } = await import('url')

  const __dirname = dirname(fileURLToPath(import.meta.url))
  config({ path: join(__dirname, '..', '..', '.env') })
}

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(2703),
    HOST: Joi.string().default('localhost'),
    DB_NAME: Joi.string().required().description('name of database').default('default'),
    JWT_ACCESS_TOKEN_LIFE: Joi.number().default(30).description('minutes life for expired access token'),
    JWT_REFRESH_TOKEN_LIFE: Joi.number().default(30).description('days life for expired refresh token'),
    JWT_VALIDATE_ACCOUNT_TOKEN_LIFE: Joi.number().default(5).description('minutes life for expired validate account token'),
    JWT_ACCESS_TOKEN_KEY: Joi.string().required().description('JWT access token key'),
    JWT_REFRESH_TOKEN_KEY: Joi.string().required().description('JWT refresh token key'),
    JWT_VALIDATE_ACCOUNT_TOKEN_KEY: Joi.string().required().description('JWT validate account token key'),
    JWT_DEFAULT_TOKEN_KEY: Joi.string().required().description('JWT default token key'),
    JWT_SECURE_RESETPW_TOKEN_KEY: Joi.string().required().description('JWT secure token key'),
    DEV_SMTP_HOST: Joi.string().description('server that will send the emails'),
    DEV_SMTP_PORT: Joi.number().description('port to connect to the email server'),
    DEV_SMTP_USERNAME: Joi.string().description('username for email server'),
    DEV_SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    PROD_MAIL_USERNAME: Joi.string().description('username for email server'),
    PROD_MAIL_PASSWORD: Joi.string().description('password for email server'),
    CLIENT_JWT_RESET_PW_TOKEN: Joi.string().required().description('JWT in client-side to identify reset password request of user'),
    CLOUD_NAME: Joi.string().description('cloud name'),
    API_KEY: Joi.string().description('api key for cloudinary'),
    API_SECRET: Joi.string().description('api secret for cloudinary'),
    UPLOAD_PRESET_1: Joi.string().description('folder media on cloudinary 1st'),
    REDIS_URL: Joi.string().description('redis url'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}
export const clientRPTokenKey = envVars.CLIENT_JWT_RESET_PW_TOKEN
export const accessTokenLife = envVars.JWT_ACCESS_TOKEN_LIFE
export const refreshTokenLife = envVars.JWT_REFRESH_TOKEN_LIFE
export const accessTokenKey = envVars.JWT_ACCESS_TOKEN_KEY
export const refreshTokenKey = envVars.JWT_REFRESH_TOKEN_KEY
export const validateAccountTokenKey = envVars.JWT_VALIDATE_ACCOUNT_TOKEN_KEY
export const validateAccountTokenLife = envVars.JWT_VALIDATE_ACCOUNT_TOKEN_LIFE
export const defaultTokenKey = envVars.JWT_DEFAULT_TOKEN_KEY
export const secureTokenKey = envVars.JWT_SECURE_RESETPW_TOKEN_KEY
export const mailKeyAPI = envVars.SENDGRID_API_KEY
export const mailSender = envVars.SENDGRID_SENDER
export const dbName = envVars.DB_NAME
export const nodeEnv = envVars.NODE_ENV
export const port = envVars.PORT
export const cloudName = envVars.CLOUD_NAME
export const apiKey = envVars.API_KEY
export const apiSecret = envVars.API_SECRET
export const uploadPreset1 = envVars.UPLOAD_PRESET_1
export const redisUrl = envVars.REDIS_URL
export const host = envVars.HOST
export const email = (nodeEnv === 'development' || nodeEnv === 'test')
  ? {
    smtp: {
      host: envVars.DEV_SMTP_HOST,
      port: envVars.DEV_SMTP_PORT,
      auth: {
        user: envVars.DEV_SMTP_USERNAME,
        pass: envVars.DEV_SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  }
  : {
    smtp: {
      service: 'Gmail',
      auth: {
        user: envVars.PROD_MAIL_USERNAME,
        pass: envVars.PROD_MAIL_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  }
