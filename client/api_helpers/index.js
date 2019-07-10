import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'express-jwt'
import constant from './constants'
import Nano from 'nano'

export const nanoInstance = new Nano(
  process.env.NODE_ENV === 'production'
  ? `http://${process.env.DB_URL}:5984`
  : 'http://localhost:5984'
)

export async function getUser (request) {
  return new Promise((resolve, reject) => {
    const extractJWTFromCookies = () => {
      request.headers.authorization =
        request.cookies[`auth._token.${request.cookies['auth.strategy']}`]
      if (request.headers.authorization === 'false') {
        return reject(new Error('No Auth token found'))
      }
      jwt({
        secret: constants.secret
      })(request, request.res, err => {
        if (err) {
          reject(err)
        }
        resolve(request.user)
      })
    }
    if (!request.cookies) {
      cookieParser()(request, request.res, extractJWTFromCookies)
    } else {
      extractJWTFromCookies()
    }
  })
}

export async function hashPassword (password) {
  return bcrypt.hash(password, constants.saltRounds)
}
export async function checkPassword (password, hash) {
  return bcrypt.compare(password, hash)
}

export const constants = constant
