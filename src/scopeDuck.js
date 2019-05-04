import scopeAction from "./scopeAction";
import scopeReducer from "./scopeReducer";
import scopeActionType from "./scopeActionType";

/**
 * Scopes a whole duck.
 * 
 * Takes a duck and returns a scoped version. All scrion types, action creators and the reducer are scoped.
 * 
 * @example
 * 
 * // src/valueDuck.js
 * export const SET_VALUE = "app/reducerA/SET_VALUE"
 * export const setValue = payload => ({
 *  type: SET_VALUE,
 *  payload
 * })
 * export default (state = 0, action) => action.type === SET_VALUE
 *  ? action.payload
 *  : state
 * 
 * // src/valueADuck.js
 * import * as valueDuck from "./valueDuck"
 * export const duck = scopeDuck("valueA", valueDuck)
 * 
 * // src/valueBDuck.js
 * import * as valueDuck from "./valueDuck"
 * export const duck = scopeDuck("valueB", valueDuck)
 * 
 * @param {string} scope 
 * @param {object} duck 
 * @returns {object} scoped duck - all action types/creators and the reducer are scoped
 */

const scopeDuck = (scope, duck) => {
  const isDuckObject =
    !Array.isArray(duck) && duck !== null && typeof duck === "object";
  const hasDuckReducer = duck && typeof duck.default === "function";

  return isDuckObject && hasDuckReducer
    ? Object.keys(duck).reduce((scopedDuck, key) => {
        if (key === "default") {
          scopedDuck[key] = scopeReducer(scope, duck[key]);
        } else if (typeof duck[key] === "function") {
          scopedDuck[key] = scopeAction(scope, duck[key]);
        } else if (RegExp(/^[A-Z_]/g).test(key)) {
          scopedDuck[key] = scopeActionType(scope, duck[key]);
        } else {
          scopedDuck[key] = duck[key];
        }
        return scopedDuck;
      }, {})
    : duck;
};
export default scopeDuck;
