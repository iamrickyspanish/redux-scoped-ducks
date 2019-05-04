import scopeAction from "./scopeAction";
import scopeReducer from "./scopeReducer";
import scopeActionType from "./scopeActionType";

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
