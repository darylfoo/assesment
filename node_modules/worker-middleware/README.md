# worker-middleware
```javascript
const Worker = require("worker-middleware").Worker;

var w = new Worker();
w.do(function (context, next) {
  context.username = "John Doe";
  context.email = "john.doe@gmail.com";
  next();
});
w.do(function (context, next) {
  setTimeout(function () {
    context.verify_user = true;
    next();
  }, 2000);
});
w.run(function (context, err) {
  if (err) {
    return console.error(err);
  }
  console.log(context);
});
```

## Installation
```
$ npm install worker-middleware --save
```
