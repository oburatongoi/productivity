# dirty-object

This library observes changes in a javascript objects property values.

### Installation
```
npm install --save dirty-object
```

### Usage

The general usage is fairly simple as to avoid the headache of adding and removing observer's onto a Javascript Object. Instead a single function call can be used.

_example_

```
const { observe } = require('dirty-object');

const CoolObject = {
  coolProp: 'Awesome!',
  otherProp: 'Okay~',
  uncoolProp: 'Meh.'
}

observe(CoolObject);
```

By calling observe on the object, setters and getters are now redefined for its properties (aside from functions). With this we can observe any mutations as they happen.

_example_
```
CoolObject.otherProp = 'NotSoBad';

console.log(CoolObject.dirty);

// output => true
```

### Configuration

#### setLogging (boolean)
Output a log every time a property is set.

#### getLogging (boolean)
Output a log every time a property is retrieved.

#### date (boolean)
Adds a last_modified value to the object.

#### name (String)
Reassigns naming convention for the dirty flag.

_sample config_
```
const { configure } = require('dirty-object');

configure({
  date: true,
  name: '__modified__',  // defaults to 'dirty'
  setLogging: true
});
```

With those two configuration options set our modifications will tell us a little bit more about whats going on.

_example_

```
// with configuration above
const data = {
  firstName: 'Alex',
  lastName: 'Bell',
  address: {
    city: 'Seattle'
  }
};

observe(data);

// modify our data
data.address.city = 'Shoreline';

console.log(JSON.stringify(data, null, 2));
```

_expected output_

```
setting prop city with Shoreline  // log
{
  "__modified__": true,
  "firstName": "Alex",
  "lastName": "Bell",
  "address": {
    "city": "Shoreline"
  },
  "last_modified": 1494063621579
}
```
