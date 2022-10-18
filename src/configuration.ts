import Logger from '@uncover/js-utils-logger'
const LOGGER = new Logger('CONFIG')

//
const CONFIG = {
  ALPHA_BASKET_DATABASE_CONN: '',

  ALPHA_BASKET_REST_PROTOCOL: 'http',
  ALPHA_BASKET_REST_HOST: 'localhost',
  ALPHA_BASKET_REST_PORT: '8090',
  ALPHA_BASKET_REST_ROOT: '',

  ALPHA_BASKET_SMTP_HOST: '',
  ALPHA_BASKET_SMTP_PORT: '',
  ALPHA_BASKET_SMTP_USER: '',
  ALPHA_BASKET_SMTP_PASS: '',
}

// Load config from local file
try {
  const CONFIG_LOCAL = require('./config.json')
  Object.keys(CONFIG).forEach((key) => {
    CONFIG[key] = CONFIG_LOCAL[key] || CONFIG[key]
  })

} catch (error) {
  LOGGER.warn('Failed to load config.json')
}

// Load config from env
try {
  Object.keys(CONFIG).forEach((key) => {
    CONFIG[key] = process.env[key] || CONFIG[key]
  })
} catch (error) {
  LOGGER.warn('Failed to load from process.env')
}

console.log('== -----------------------------')
Object.keys(CONFIG).forEach((key) => console.log(`== ${key}: ${CONFIG[key]}`))
console.log('== -----------------------------')

export default CONFIG
