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
// import module
import { UriBuilder } from 'uribuilder';

const testURI = 'https://www.google.com/search?q=wiki';

// Create Builder from current URI
const builder = UriBuilder.parse(testURI);

// Set Query Param
builder.query.q = 'newKeyword';

// Log builder result, result: 'https://www.google.com/search?q=newKeyword'
console.log(builder.toString());

// Set Fragment
builder.fragment = 'hash';

// Log builder result, result: 'https://www.google.com/search?q=newKeyword#hash'
console.log(builder.toString());

// Update input URI Query
const updatedURI = UriBuilder.updateQuery(testURI, {
  q: 'test',
  hw: ['a', 'b'] //Query Param: Array
});

// Log updated URI, result: 'https://www.google.com/search?q=test&hw=a&hw=b'
console.log(updatedURI);

// Create UriBuilder
const emptyBuilder = new UriBuilder();
emptyBuilder.schema = 'http';
emptyBuilder.host = 'example';
emptyBuilder.setPath('/home/index');
emptyBuilder.fragment = 'top';
emptyBuilder.setAuthority('guest');
emptyBuilder.query.action = 'back';
emptyBuilder.query.chinese = '中文';

// Log builder result, result: http://guest@example/home/index?action=back&chinese=%E4%B8%AD%E6%96%87#top
console.log(emptyBuilder.toString());
```