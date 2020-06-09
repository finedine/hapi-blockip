# hapi-blockip

[![NPM version][npm-image]][npm-url]

hapi-blockip is a [hapi](https://hapi.dev/) plugin for blocking IP addresses.

## What hapi-blockip does?

hapi-blockip responses to the requests coming from blocked IP addreses with [403](https://en.wikipedia.org/wiki/HTTP_403).

## Installation

```bash
npm i npm i @bambulabs/hapi-blockip
```

## Usage

```nodejs
 const HapiBlockIP = require("@bambulabs/hapi-blockip");

 await server.register({
   plugin: HapiBlockIP,
     options: {
       blocklist: ["127.0.0.1"]
     }
 });
```

### Support

hapi-blockip supports **IPV4** and **IPV6**.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

[npm-image]: https://img.shields.io/npm/v/@bambulabs/hapi-blockip.svg?style=flat
[npm-url]: https://www.npmjs.com/package/@bambulabs/hapi-blockip
