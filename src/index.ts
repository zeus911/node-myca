/**
 * node-myca
 *
 * @author waiting
 * @license MIT
 * @link https://github.com/waitingsong/node-myca
 */


import { normalize } from 'path'

import { getOpensslVer } from './lib/common'
import { config } from './lib/config'


config.isWin32 = process.platform === 'win32' ? true : false
config.userHome = config.isWin32 ? normalize(process.env.USERPROFILE || '') : normalize(`${process.env.HOME}`)
config.defaultCenterPath = normalize(`${config.userHome}/${config.centerDirName}`) // dir contains conf file and folders
config.openssl = normalize(config.openssl)

if ( ! config.opensslVer) {
  getOpensslVer(config.openssl).then(ver => {
    config.opensslVer = ver
  })
}
if ( ! config.userHome) {
  throw new Error('path of user profile empty')
}

export * from './lib/center'
export * from './lib/cert'
export * from './lib/model'
