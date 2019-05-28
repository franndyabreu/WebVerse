# Platziverse-db Module

## Usage

```js
const setUpDatabase = require("platziverse-db");

setUpDatabase(config)
  .then(db => {
    const { Agent, Metric } = db;
  })
  .catch(err => console.log(err));
```
