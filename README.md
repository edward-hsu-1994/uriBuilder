# uriBuilder
[![npm version](https://badge.fury.io/js/uribuilder.svg)](https://badge.fury.io/js/uribuilder)
[![Build Status](https://travis-ci.org/XuPeiYao/uriBuilder.svg?branch=master)](https://travis-ci.org/XuPeiYao/uriBuilder) [![Downloads](https://img.shields.io/npm/dm/uriBuilder.svg)](https://www.npmjs.com/package/uriBuilder) [![license](https://img.shields.io/github/license/xupeiyao/uribuilder.svg)](https://github.com/XuPeiYao/uriBuilder/blob/master/LICENSE)

URI parser and builder

## Install
```powershell
npm install uribuilder
```

## Getting Started
```typescript
import { UriBuilder } from 'uribuilder';

const testURI = 'https://www.google.com/search?q=wiki';
const builder: UriBuilder = UriBuilder.parse(testURI);
builder.query.q = 'newKeyword';
console.log(builder.toString()); //result: 'https://www.google.com/search?q=newKeyword'

builder.fragment = 'hash';
console.log(builder.toString()); //result: 'https://www.google.com/search?q=newKeyword#hash'

const updatedURI = UriBuilder.updateQuery(testURI, {
  q: 'test',
  hw: ['a', 'b']
});
console.log(updatedURI); //result: 'https://www.google.com/search?q=test&hw=a&hw=b'
```