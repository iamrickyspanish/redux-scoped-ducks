# redux-scoped-ducks

[![Coverage Status](https://coveralls.io/repos/github/iamrickyspanish/redux-scoped-ducks/badge.svg?branch=master)](https://coveralls.io/github/iamrickyspanish/redux-scoped-ducks?branch=master)
[![CircleCI](https://circleci.com/gh/iamrickyspanish/redux-scoped-ducks.svg?style=svg)](https://circleci.com/gh/iamrickyspanish/redux-scoped-ducks)

A handfull of functions to make redux [ducks](https://github.com/erikras/ducks-modular-redux) reusable.

For this library to work poperly, your redux logic should be organized in ducks. Please read this first: https://github.com/erikras/ducks-modular-redux

## usage - a simple example

Assume you have a simple duck that contains all the redux stuff to handle a counter logic:

```javascript
// src/counter/duck.js
export const INCREMENT = "app/counter/INCREMENT"
export const DECREMENT = "app/counter/DECREMENT"

export const increment = () => ({ type: INCREMENT })
export const decrement = () => ({ type: DECREMENT })

export default (state = 0, action) => {
  switch(action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
  }
}
```
Let's say you need to implement two new features, `scorePlayerA` and `scorePlayerB`, that need some state to keep track of their score values. Reusing our counter duck would be perfect for this purpose. To be able to reuse a duck we must scope it.

For this purpose we create a duck factory that will allow us to create scoped versions of our counter duck. 

```javascript
// src/counter/duckFactory.js
import { createScopedDuckFactory } from "redux-scoped-ducks";
import * as counterDuck from "./duck"

export default createScopedDuckFactory(counterDuck);
``` 

Cool, now spinning up the redux logic for your new features `scorePlayerA` and `scorePlayerB` is dead simple:

```javascript
// src/scorePlayerA/duck.js
import counterDuckFactory from "../counter/duckFactory";
export default counterDuckFactory("scorePlayerA");
```

```javascript
// src/scorePlayerB/duck.js
import counterDuckFactory from "../counter/duckFactory";
export default counterDuckFactory("scorePlayerB");
```

All that is left to do is adding the reducers of your newly created ducks to your store

```javascript
// src/store.js
import { combineReducers, createStore } from "redux";
import scorePlayerADuck from "./scorePlayerA/duck";
import scorePlayerBDuck from "./scorePlayerB/duck";

// ...

// get the reducers
const { default: scorePlayerA } = scorePlayerADuck;
const { default: scorePlayerB } = scorePlayerBDuck;

//create store with reducers
const store = createStore(combineReducers({ scorePlayerA, scorePlayerB }))

export default store
```

Thats it! Now you can use the action creators of your ducks.

```javascript
import scorePlayerADuck from "scorePlayerA/duck";
import scorePlayerBDuck from "scorePlayerB/duck";
import store from "src/store"

const { increment: incrementScorePlayerA } = scorePlayerADuck;
const { increment: incrementScorePlayerB } = scorePlayerBDuck;

store.dispatch(incrementScorePlayerA())
store.dispatch(incrementScorePlayerB())

```

## API Documentation

`redux-scoped-ducks` exposes the following self-explanatory functions:

+ createScopedDuckFactory(duck) → {function}
+ scopeAction(scope, action) → {object|function}
+ scopeActionType(scope, actionType) → {string}
+ scopeDuck(scope, duck) → {object}
+ scopeReducer(scope, reducer) → {function}

See the full API documentation here: 
https://iamrickyspanish.github.io/redux-scoped-ducks

## What does "scoping a duck" mean?

Scoping means to manipulate the action types used in a duck by replacing the reducer info. So `app/reducerA/ACTION` becomes `app/reducerB/ACTION`. This affects action types, the actions returned by creatorsAdditionaly and the reducer.
Additionaly a meta attribute `unscopedActionType` is added to all actions returned by the ducks action creators.

*Scoped reducers act exactly like their unscoped originals, the only difference is that they ignore actions that aren't of the same scope (reducer part in action type + meta attribute `unscopedActionType`)*
