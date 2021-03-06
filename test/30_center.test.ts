/// <reference types="mocha" />

import {
  basename,
  createDirAsync,
  isDirExists,
  isFileExists,
  join,
  tmpdir,
  unlinkAsync,
  writeFileAsync,
 } from '@waiting/shared-core'
import * as assert from 'power-assert'
import rewire = require('rewire')
import * as rmdir from 'rimraf'
import { Observable } from 'rxjs'

import * as myca from '../src/index'
import { genRandomCenterPath } from '../src/lib/common'
import { initialConfig, initialDbFiles } from '../src/lib/config'


const mods = rewire('../src/lib/center')

const filename = basename(__filename)
const tmpDir = join(tmpdir(), 'myca-tmp')
const pathPrefix = 'myca-test-center'
const randomPathG = `${tmpDir}/${pathPrefix}-${Math.random()}`

// dir contains conf file and folders
// config.defaultCenterPath = normalize(`${config.userHome}/${config.centerDirName}`)
initialConfig.defaultCenterPath = `${randomPathG}/${initialConfig.centerDirName}`

describe(filename, () => {
  before(async () => {
    await createDirAsync(tmpDir)
  })
  beforeEach(async () => {
    const random = Math.random()
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`

    initialConfig.defaultCenterPath = `${randomPath}/${initialConfig.centerDirName}`
    await myca.initDefaultCenter().toPromise()
  })
  afterEach(() => {
    rmdir(join(initialConfig.defaultCenterPath, '../'), err => err && console.error(err))
  })
  after(done => {
    rmdir(tmpDir, err => err ? console.error(err) : done())
  })


  it('Should getCenterPath() works', async () => {
    try {
      const path = await myca.getCenterPath('default').toPromise()
      assert(path, 'getCenterPath("default") should return default path, but blank')
    }
    catch (ex) {
      return assert(false, ex)
    }

    const random = Math.random()
    const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const centerPath = `${randomPath}/${initialConfig.centerDirName}`

    await myca.initCenter(centerName, centerPath).toPromise()
    try {
      const path = await myca.getCenterPath(centerName).toPromise()
      assert(path, `getCenterPath('${centerName}') should return not empty result, but EMPTY`)
    }
    catch (ex) {
      return assert(false, ex)
    }

    rmdir(randomPath, err => err && console.error(err))
  })

  it('Should getCenterPath() works with invalid param', async () => {
    const random = Math.random() + ''

    try {
      const centerPath = await myca.getCenterPath(random).toPromise()

      centerPath && assert(false, 'getCenterPath() should return empty result with invalid centerName, but NOT')
    }
    catch (ex) {
      assert(true)
    }
  })


  it('Should createCenter() works', async () => {
    const random = Math.random()
    const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const centerPath = `${randomPath}/${initialConfig.centerDirName}`
    const fnName = 'createCenter'
    const fn = <(config: myca.Config, centerName: string, path: string) => Observable<string>> mods.__get__(fnName)

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      await fn(initialConfig, centerName, centerPath).toPromise()
    }
    catch (ex) {
      return assert(false, ex)
    }

    if (! await isDirExists(centerPath)) {
      return assert(false, `spcified center folder not exists, path: "${centerPath}"`)
    }

    rmdir(randomPath, err => err && console.error(err))
  })

  it('Should createCenter() works', async () => {
    const random = Math.random()
    const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const centerPath = `${randomPath}/${initialConfig.centerDirName}`
    const folders: string[] = [
      initialConfig.dbDir,
      initialConfig.serverDir,
      initialConfig.clientDir,
      initialConfig.dbCertsDir,
    ]
    const fnName = 'createCenter'
    const fn = <(config: myca.Config, centerName: string, path: string) => Observable<string>> mods.__get__(fnName)

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      await fn(initialConfig, centerName, centerPath).toPromise()
    }
    catch (ex) {
      return assert(false, ex)
    }

    for (const name of folders) {
      const dir = join(centerPath, name)

      if (! await isDirExists(dir)) {
        return assert(false, `spcified center folder not exists, path: "${dir}"`)
      }
    }

    rmdir(randomPath, err => err && console.error(err))
  })

  it('Should createCenter() works with invalid param', async () => {
    const random = Math.random()
    // const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const centerPath = `${randomPath}/${initialConfig.centerDirName}`
    const fnName = 'createCenter'
    const fn = <(config: myca.Config, centerName: string, path: string) => Observable<string>> mods.__get__(fnName)
    const folders: string[] = [
      initialConfig.dbDir,
      initialConfig.serverDir,
      initialConfig.clientDir,
      initialConfig.dbCertsDir,
    ]

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      await fn(initialConfig, '', centerPath).toPromise()
      assert(false, 'createCenter() should throw error with empty value of centerName, but NOT')
    }
    catch (ex) {
      assert(true)
    }

    for (const name of folders) {
      const dir = join(centerPath, name)

      if (await isDirExists(dir)) {
        return assert(false, `spcified center folder should NOT exists, path: "${dir}"`)
      }
    }

    rmdir(randomPath, err => err && console.error(err))
  })

  it('Should createCenter() works with invalid param', async () => {
    const random = Math.random()
    const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const centerPath = `${randomPath}/${initialConfig.centerDirName}`
    const fnName = 'createCenter'
    const fn = <(config: myca.Config, centerName: string, path: string) => Observable<string>> mods.__get__(fnName)
    const folders: string[] = [
      initialConfig.dbDir,
      initialConfig.serverDir,
      initialConfig.clientDir,
      initialConfig.dbCertsDir,
    ]

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      await fn(initialConfig, centerName, '').toPromise()
      assert(false, 'createCenter() should throw error with empty value of centerName, but NOT')
    }
    catch (ex) {
      assert(true)
    }

    for (const name of folders) {
      const dir = join(centerPath, name)

      if (await isDirExists(dir)) {
        return assert(false, `spcified center folder should NOT exists, path: "${dir}"`)
      }
    }

    rmdir(randomPath, err => err && console.error(err))
  })


  it('Should createCenterListFile() works', async () => {
    const random = Math.random()
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const randomFile = `${randomPath}/test`
    const fnName = 'createCenterListFile'
    const fn = <(file: string) => Promise<void>> mods.__get__(fnName)

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      await fn(randomFile)
    }
    catch (ex) {
      return assert(false, ex)
    }

    try {
      await fn(randomFile)
      assert(false, `should throw error during create duplicate file, but NOT. file: "${randomFile}"`)
    }
    catch (ex) {
      return assert(true)
    }

    rmdir(randomPath, err => err && console.error(err))
  })


  it('Should initDbFiles() works', async () => {
    const random = Math.random()
    // const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const fnName = 'initDbFiles'
    const fn = <(config: myca.Config, path: string, files: myca.InitialFile[]) => Promise<void>> mods.__get__(fnName)
    const db = `${randomPath}/${initialConfig.dbDir}`
    const files = initialDbFiles

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      await fn(initialConfig, randomPath, files)
    }
    catch (ex) {
      rmdir(randomPath, err => err && console.error(err))
      return assert(false, ex)
    }
    for (const file of files) {
      const path = `${db}/${file.name}`

      if (! await isFileExists(path)) {
        assert(false, `file not exists. path: "${path}"`)
      }
    }

    rmdir(randomPath, err => err && console.error(err))
  })

  it('Should initDbFiles() works without mode value', async () => {
    const random = Math.random()
    // const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const fnName = 'initDbFiles'
    const fn = <(config: myca.Config, path: string, files: myca.InitialFile[]) => Promise<void>> mods.__get__(fnName)
    const db = `${randomPath}/${initialConfig.dbDir}`
    const files = [
      {
        name: 'serial',
        defaultValue: '01',
      },
      {
        name: 'index',
        defaultValue: '',
        mode: 0o644,
      },
    ]

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      await fn(initialConfig, randomPath, files)
    }
    catch (ex) {
      rmdir(randomPath, err => err && console.error(err))
      return assert(false, ex)
    }
    for (const file of files) {
      const path = `${db}/${file.name}`

      if (! await isFileExists(path)) {
        assert(false, `file not exists. path: "${path}"`)
      }
    }

    rmdir(randomPath, err => err && console.error(err))
  })


  it('Should initDbFiles() works with invalid param', async () => {
    const random = Math.random()
    // const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const fnName = 'initDbFiles'
    const fn = <(config: myca.Config, path: string, files: myca.InitialFile[]) => Promise<void>> mods.__get__(fnName)
    // const db = `${randomPath}/${config.dbDir}`
    let files: myca.InitialFile[] = [
      { name: '', defaultValue: '' },
    ]

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      await fn(initialConfig, '', files)
      return assert(false, 'initDbFiles() should throw error, but NOT')
    }
    catch (ex) {
      assert(true)
    }

    try {
      await fn(initialConfig, randomPath, files)
      return assert(false, 'initDbFiles() should throw error, but NOT')
    }
    catch (ex) {
      assert(true)
    }

    // files = [
    //   { name: 'test', defaultValue: null },
    // ]
    // try {
    //   await fn(initialConfig, randomPath, files)
    //   return assert(false, 'initDbFiles() should throw error, but NOT')
    // }
    // catch (ex) {
    //   assert(true)
    // }

    files = []
    try {
      await fn(initialConfig, randomPath, files)
      return assert(false, 'initDbFiles() should throw error, but NOT')
    }
    catch (ex) {
      assert(true)
    }

    rmdir(randomPath, err => err && console.error(err))
  })


  it('Should nextSerial() works', async () => {
    try {
      const serial = await myca.nextSerial('default', initialConfig).toPromise()

      assert(serial === '01', `value of serial should be 01, but got: "${serial}"`)
    }
    catch (ex) {
      return assert(false, ex)
    }
  })

  it('Should nextSerial() works with blank centerName', async () => {
    try {
      const serial = await myca.nextSerial('', initialConfig).toPromise()

      return assert(serial, 'should throw error, but NOT')
    }
    catch (ex) {
      return assert(true)
    }
  })

  it('Should nextSerial() works with reading invalid serial', async () => {
    const centerName = 'default'
    const centerPath = await myca.getCenterPath(centerName).toPromise()
    const serialFile = `${centerPath}/db/serial`

    try {
      await writeFileAsync(serialFile, 'BARZ')
      const serial = await myca.nextSerial(centerName, initialConfig).toPromise()

      return assert(false, `should throw error, but NOT. serial:"${serial}"`)
    }
    catch (ex) {
      return assert(true)
    }
  })

  it('Should nextSerial() works with reading unsafe integer serial', async () => {
    const centerName = 'default'
    const centerPath = await myca.getCenterPath(centerName).toPromise()
    const serialFile = `${centerPath}/db/serial`

    try {
      await writeFileAsync(serialFile, Math.pow(2, 53).toString(16))
      const serial = await myca.nextSerial(centerName, initialConfig).toPromise()

      return assert(false, `should throw error, but NOT. serial:"${serial}"`)
    }
    catch (ex) {
      return assert(true)
    }
  })

  it('Should nextSerial() works with reading 0', async () => {
    const centerName = 'default'
    const centerPath = await myca.getCenterPath(centerName).toPromise()
    const serialFile = `${centerPath}/db/serial`

    try {
      await writeFileAsync(serialFile, 0)
      const serial = await myca.nextSerial(centerName, initialConfig).toPromise()

      return assert(false, `should throw error, but NOT. serial:"${serial}"`)
    }
    catch (ex) {
      return assert(true)
    }
  })


  it('Should addCenterList() works', async () => {
    const random = Math.random()
    const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const centerPath = `${randomPath}/${initialConfig.centerDirName}`
    const fnName = 'addCenterList'
    const fn = <(config: myca.Config, key: string, path: string) => Promise<void>> mods.__get__(fnName)

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      await createDirAsync(centerPath)
      await fn(initialConfig, centerName, centerPath)
    }
    catch (ex) {
      return assert(false, ex)
    }

    if (! await isDirExists(centerPath)) {
      return assert(false, `spcified center folder not exists, path: "${centerPath}"`)
    }

    rmdir(randomPath, err => err && console.error(err))
  })

  it('Should addCenterList() works with invalid param', async () => {
    const random = Math.random()
    const centerName = `${pathPrefix}-${random}`
    const randomPath = `${tmpDir}/${pathPrefix}-${random}`
    const centerPath = `${randomPath}/${initialConfig.centerDirName}`
    const fnName = 'addCenterList'
    const fn = <(config: myca.Config, key: string, path: string) => Promise<void>> mods.__get__(fnName)

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    await createDirAsync(centerPath)

    try {
      await fn(initialConfig, '', centerPath)
      return assert(false, 'should throw error with blank centerName, but NOT')
    }
    catch (ex) {
      assert(true)
    }
    try {
      await fn(initialConfig, centerName, '')
      return assert(false, 'should throw error with blank centerPath, but NOT')
    }
    catch (ex) {
      assert(true)
    }
    try {
      await fn(initialConfig, 'default', centerPath)
      return assert(false, 'should throw error with blank centerPath, but NOT')
    }
    catch (ex) {
      assert(true)
    }

    if (! await isDirExists(centerPath)) {
      return assert(false, `spcified center folder not exists, path: "${centerPath}"`)
    }

    rmdir(randomPath, err => err && console.error(err))
  })


  it('Should loadCenterList() works', async () => {
    const fnName = 'loadCenterList'
    const fn = <(config: myca.Config) => Observable<myca.CenterList | null>> mods.__get__(fnName)

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }

    try {
      const ret = await fn(initialConfig).toPromise()

      if (! ret || ! ret.default) {
        assert(false, 'should return valid centerList object')
      }
    }
    catch (ex) {
      assert(false, ex)
    }
  })


  // --------------- at last

  it('Should loadCenterList() works without centerList file', async () => {
    const fnName = 'loadCenterList'
    const fn = <(config: myca.Config) => Observable<myca.CenterList | null>> mods.__get__(fnName)

    if (typeof fn !== 'function') {
      return assert(false, `${fnName} is not a function`)
    }
    const file = join(initialConfig.defaultCenterPath, initialConfig.centerListName)

    try {
      await unlinkAsync(file)
      await fn(initialConfig).toPromise()
      assert(false, 'should throw error, but NOT')
    }
    catch (ex) {
      assert(true)
    }
  })


})


describe(filename, () => {
  beforeEach(async () => {
    await createDirAsync(tmpDir)
    await myca.initDefaultCenter().toPromise()
  })
  afterEach(done => {
    rmdir(tmpDir, err => err ? console.error(err) : done())
  })

  describe('Should initCenter() works', () => {
    it('normal', async () => {
      const random = Math.random()
      const centerName = `${pathPrefix}-${random}`
      const randomPath = `${tmpDir}/${pathPrefix}-${random}`
      const centerPath = `${randomPath}/${initialConfig.centerDirName}`

      try {
        await myca.initCenter(centerName, centerPath).toPromise()
      }
      catch (ex) {
        return assert(false, ex)
      }

      if (! await isDirExists(centerPath)) {
        return assert(false, `spcified center folder not exists, path: "${centerPath}"`)
      }

      assert(
        await myca.isCenterInited(centerName).toPromise(),
        `isCenterInited(${centerName}) says folder not exits. path: "${centerPath}"`)

      // create again
      try {
        await myca.initCenter(centerName, centerPath).toPromise()
        return assert(false, 'initCenter() should throw error for already created folder, but NOT')
      }
      catch (ex) {
        assert(true)
      }
      try {
        await myca.initCenter(centerName, 'fakePath').toPromise()
        return assert(false, 'initCenter() should throw error for already created centerName, but NOT')
      }
      catch (ex) {
        assert(true)
      }
      try {
        await myca.initCenter('fakeName', centerPath).toPromise()
        return assert(false, 'initCenter() should throw error for already created folder(s), but NOT')
      }
      catch (ex) {
        assert(true)
      }

      rmdir(randomPath, err => err && console.error(err))
    })

    it('without centerPath param (use centerName as suffix)', async () => {
      const random = Math.random()
      const centerName = `${pathPrefix}-${random}`
      const centerPath = genRandomCenterPath(centerName)

      try {
        await myca.initCenter(centerName).toPromise()
      }
      catch (ex) {
        return assert(false, ex)
      }

      if (! await isDirExists(centerPath)) {
        return assert(false, `spcified center folder not exists, path: "${centerPath}"`)
      }

      assert(
        await myca.isCenterInited(centerName).toPromise(),
        `isCenterInited(${centerName}) says folder not exits`)
    })


    it('with invalid param', async () => {
      const random = Math.random()
      const centerName = `${pathPrefix}-${random}`
      const randomPath = `${tmpDir}/${pathPrefix}-${random}`
      const centerPath = `${randomPath}/${initialConfig.centerDirName}`

      try {
        await myca.initCenter('default', centerPath).toPromise()  // 'default' not allowed
        return assert(false, 'initCenter("default") should throw error for value default not allowed, but NOT')
      }
      catch (ex) {
        assert(true)
      }

      try {
        await myca.initCenter('', centerPath).toPromise()
        return assert(false, 'initCenter() should throw error for invalid param of centerName, but NOT')
      }
      catch (ex) {
        assert(true)
      }

      if (await isDirExists(centerPath)) {
        return assert(false, `spcified center folder should not exists, but did exists, path: "${centerPath}"`)
      }

      assert(
        ! await myca.isCenterInited(centerName).toPromise(),
        `isCenterInited(${centerName}) says folder exits, but should NOT. path: "${centerPath}"`)

      rmdir(randomPath, err => err && console.error(err))
    })


  })
})
