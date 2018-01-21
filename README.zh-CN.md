# myca
使用 openssl 和 node.js 创建自有 CA 中心（自签发CA证书或者上级CA签发的中级CA证书），签发自签名数字证书。支持创建多个 CA 中心

[![Version](https://img.shields.io/npm/v/myca.svg)](https://www.npmjs.com/package/myca)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)


## 安装
```bash
npm install --save myca
```

## 使用
- 初始化默认中心
```js
myca.initDefaultCenter().catch(console.error)
```

- 初始化默认中心的 CA 自签发证书
```js
 import * as myca from 'myca'

 myca
   .initCaCert({
     days: 10950,  // 30years
     pass: 'mycapass',
     CN: 'My Root CA',    // Common Name
     OU: 'waitingsong.com',   // Organizational Unit Name
     O: '',   // Organization Name (eg, company)
     L: '',    // Locality Name (eg, city)
     ST: '',   // State or Province Name
     C: 'CN',   // Country Name (2 letter code)
     emailAddress: '',
   })
   .catch(console.error)
```

- 签发一张 RSA 服务器证书
```js
 import * as myca from 'myca'

 myca
   .genCert({
     caKeyPass: 'mycapass',
     kind: 'server',   // server cert
     days: 730,
     pass: 'fooo',   // at least 4 letters
     CN: 'www.waitingsong.com',    // Common Name
     OU: '',   // Organizational Unit Name
     O: '',   // Organization Name
     L: '',    // Locality Name (eg, city)
     ST: '',   // State or Province Name
     C: 'CN',   // Country Name (2 letter code)
     emailAddress: '',
   })
   .then((ret) => {
     console.log(ret.cert)
     console.log(ret.crtFile)
     console.log(ret.privateUnsecureKey)
   })
   .catch(console.error)
```

- 创建额外的中心，并且自签发 EC 算法的CA证书 (默认 P-256)
```js
 import * as myca from 'myca'

 myca.initCenter('ec', '/opt/center-ec')
   .then(() => {
     return myca.initCaCert({
       centerName: 'ec',
       alg: 'ec',
       days: 10950,  // 30years
       pass: 'mycapass',
       CN: 'My Root CA',    // Common Name
       OU: 'waitingsong.com',   // Organizational Unit Name
       C: 'CN',   // Country Name (2 letter code)
     })
   })
   .catch(console.error)
```

- 使用指定的中心签发一张 RSA 服务器证书
```js
 import * as myca from 'myca'

 myca
   .genCert({
     centerName: 'ec',  // <--- 指定中心名: ec
     caKeyPass: 'mycapass',
     kind: 'server',   // server cert
     days: 730,
     pass: 'fooo',   // at least 4 letters
     CN: 'www.waitingsong.com',    // Common Name
     OU: '',   // Organizational Unit Name
     O: '',   // Organization Name
     L: '',    // Locality Name (eg, city)
     ST: '',   // State or Province Name
     C: 'CN',   // Country Name (2 letter code)
     emailAddress: '',
   })
   .then((ret) => {
     console.log(ret.cert)
     console.log(ret.crtFile)
     console.log(ret.privateUnsecureKey)
   })
   .catch(console.error)
```


## License
[MIT](LICENSE)


### Languages
- [English](README.md)
- [中文](README.zh-CN.md)