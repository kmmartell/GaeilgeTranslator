# jsonparser

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Gets the whole content in the request as a json to the property json

### Install

```sh
$ npm install jsonparser
```

## API

```js
var jsonparser = require('jsonparser');
```

### jsonparser(options)

This middleware adds a `req.json` property which contains the JSON parsed request body

#### Options
- `strict` a truthy value to check for content type header (default: false).
- `type` request content-type to parse (default: json).
- `bodyCheck` a truthy value for empty body check (default: false).

## Example

```js
var bodyparser = require('simple-bodyparser');
var jsonparser = require('jsonparser');
var app = require('express')();

app.use(bodyparser());
app.use(jsonparser());
app.use(function(req, res, next){
  var body = req.json
});
```

## License

[MIT](LICENSE)


[npm-image]: https://img.shields.io/npm/v/jsonparser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/jsonparser
[github-tag]: http://img.shields.io/github/tag/cosmosgenius/jsonparser.svg?style=flat-square
[github-url]: https://github.com/cosmosgenius/jsonparser/tags
[travis-image]: https://img.shields.io/travis/cosmosgenius/jsonparser.svg?style=flat-square
[travis-url]: https://travis-ci.org/cosmosgenius/jsonparser
[coveralls-image]: https://img.shields.io/coveralls/cosmosgenius/jsonparser.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/cosmosgenius/jsonparser?branch=master
[license-image]: http://img.shields.io/npm/l/jsonparser.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/jsonparser.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/jsonparser
[david-image]: http://img.shields.io/david/cosmosgenius/jsonparser.svg?style=flat-square
[david-url]: https://david-dm.org/cosmosgenius/jsonparser
