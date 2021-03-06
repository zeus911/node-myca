import {
  CaOpts,
  CertDNkeys,
  CertOpts,
  Config,
  InitialFile,
  IssueCaCertRet,
  IssueCertRet,
  IssueOpts,
  PrivateKeyOpts,
  SignOpts } from './model'


export const initialConfig: Config = {
  appDir: '',
  dbDir: 'db',
  dbCertsDir: 'db/certs',
  serverDir: 'server',
  clientDir: 'client',
  caKeyName: 'ca.key',
  caCrtName: 'ca.crt',

  userHome: '',
  centerDirName: '.myca',
  defaultCenterPath: '',
  centerListName: 'center-list.json',

  openssl: 'openssl',
  opensslVer: '',
  isOpensslCmdValid: false,

  isWin32: false,
  configName: '.config',  // under asset/
  confTpl: 'tpl.conf',  // under asset/
}

export const initialPrivateKeyOpts: PrivateKeyOpts = {
  // serial: 0,
  centerName: 'default',
  alg: 'rsa',
  pass: '',
  keyBits: 2048, // for alg==rsa
  ecParamgenCurve: 'P-256', // for alg==ec
}
export const initialCaOpts: CaOpts = {
  kind: 'ca',
  centerName: 'default',
  alg: 'rsa',
  days: 10950,  // 30years
  pass: '',
  keyBits: 4096,  // for alg==rsa
  ecParamgenCurve: 'P-256',
  hash: 'sha384',
  CN: '',
  OU: '',
  O: '',
  C: '',
  ST: '',
  L: '',
  emailAddress: '',
}

// sign csr
export const initialSignOpts: SignOpts = {
  kind: 'server',
  centerPath: '',
  days: 750,  // 2year
  hash: 'sha256',
  caCrtFile: '',
  caKeyFile: '',
  caKeyPass: '',
  csrFile: '',
  configFile: '',
  SAN: [],
  ips: [],
}

export const initialCertOpts: CertOpts = {
  // CertDN
  kind: 'server',
  days: 750,  // 2year
  hash: 'sha256',
  caKeyPass: '',
  SAN: [],
  ips: [],

  centerName: 'default',
  alg: 'rsa',
  pass: '',
  keyBits: 2048,
  ecParamgenCurve: 'P-256', // for alg==ec
  // DNs
  CN: '',
  OU: '',
  O: '',
  C: '',
  ST: '',
  L: '',
  emailAddress: '',
}

export const initialIssueOpts: IssueOpts = {
  serial: '', // hex
  centerName: 'default',
  alg: 'rsa',
  pass: '',
  keyBits: 2048,
  ecParamgenCurve: 'P-256', // for alg==ec
  // DNs
  CN: '',
  OU: '',
  O: '',
  C: '',
  ST: '',
  L: '',
  emailAddress: '',

  ...initialSignOpts,
}

export const reqSubjectFields: CertDNkeys[] = [
  'CN',
  'OU',
  'O',
  'L',
  'ST',
  'C',
  'emailAddress',
]

export const initialCaCertRet: IssueCaCertRet = {
  centerName: '',
  privateKey: '',
  pass: '',
  privateKeyFile: '',
  cert: '',  // certificate pem
  crtFile: '', // certificate file path
}

export const initialCertRet: IssueCertRet = {
  centerName: '',
  caKeyFile: '',
  caCrtFile: '',
  pubKey: '',     // pubkey pem
  privateKey: '',  // private key pem
  privateUnsecureKey: '',  // private key pem
  pass: '',
  privateKeyFile: '',
  privateUnsecureKeyFile: '',
  csr: '',
  csrFile: '',
  cert: '',  // certificate pem
  crtFile: '', // certificate file path
}

export const initialDbFiles: InitialFile[] = [
  {
    name: 'serial',
    defaultValue: '01',
    mode: 0o644,
  },
  {
    name: 'index',
    defaultValue: '',
    mode: 0o644,
  },
  {
    name: 'index.attr',
    defaultValue: 'unique_subject = no',
    mode: 0o644,
  },
]
