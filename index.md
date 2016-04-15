<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
<style>
body {
  padding: 0 20px;
}
h2, h3, h4 {
 padding-top: 20px
}
</style>

<h1 align="center">
  <br>
  <a href="http://standardjs.com"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard" width="200"></a>
  <br>
  Standardizer
</h1>
<p align="center">
A tiny service to lint and format JavaScript code using JavaScript Standard Style.
</p>

### GET /version
Returns the current verison of this service as well as the `standard` and `standard-format` versions its using.

**GET https://<script>document.write(window.location.hostname)</script>/version**

Response:
```js
{"version":"1.0.0","standard":"6.0.8","standard-format":"2.1.1"}
```


### POST /lint
Lint code using `standard`. Responds with the untouched JSON response from `standard.lintText`.

**POST https://<script>document.write(window.location.hostname)</script>/lint**

Payload:
```js
{ "text": "console.log('woot');\n"}
```

Response:
```js
{
  'results': [
    {
      'filePath': '<text>',
      'messages': [
        {
          'ruleId': 'semi',
          'severity': 2,
          'message': 'Extra semicolon.',
          'line': 1,
          'column': 21,
          'nodeType': 'ExpressionStatement',
          'source': "console.log('hello');",
          'fix': {
            'range': [
              20,
              21
            ],
            'text': ''
          }
        }
      ],
      'errorCount': 1,
      'warningCount': 0
    }
  ],
  'errorCount': 1,
  'warningCount': 0
}
```

### POST /format
Format code using `standard-format`. Response with a the transformed code in the `text` field.

Payload:
```js
{ "text": "console.log('hello');\n"}
```

Response:
```js
{
    "text": "console.log('hello')\n"
}
```
