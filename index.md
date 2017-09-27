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

<div style="max-width: 1000px; margin: auto">
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

<form method="get" action="/version">
<input type="submit" value="Try GET /version">
</form>

**GET https://<script>document.write(window.location.hostname)</script>/version**

Response:
```js
{"version":"1.0.0","standard":"10.0.3"}
```


### POST /lint
Lint code using `standard`. Responds with the untouched JSON response from `standard.lintText`.

<form method="post" action="/lint">
<textarea name="text" style="width: 100%">
console.log('woot');
</textarea>
<input type="submit" value="Try POST /lint">
</form>

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

### POST /fix
Lint code using `standard` and include the `--fix` flag. Responds with the untouched JSON response from `standard.lintText`. Only lint errors that were not `fix`'d will be listed. The reformatted code will be at `results[0].output`

<form method="post" action="/fix">
<textarea name="text" style="width: 100%">
console.log('hello');

</textarea>
<input type="submit" value="Try POST /fix">

</form>

Payload:
```js
{ "text": "console.log('hello');\n"}
```

Response:
```js
{
    "results": [
        {
            "filePath": "<text>",
            "messages": [],
            "errorCount": 0,
            "warningCount": 0,
            "output": "console.log('hello')\n"
        }
    ],
    "errorCount": 0,
    "warningCount": 0
}
```
</div>