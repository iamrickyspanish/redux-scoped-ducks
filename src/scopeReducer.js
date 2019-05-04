const isActionTypeScoped = (scope, actionType) => {
  const splittedActionType = actionType.split("/");
  return splittedActionType.length >= 3 && splittedActionType[1] === scope;
};

/**
 * Scopes a reducer function.
 * 
 * Accepts a scope and a reducer function and returns a scoped reducer fucnction. A scoped reducer works and can be used like a regular reducer - the only difference is that the scoped reducer will ignore all actions that aren't scoped the same.
 * If not of type "function", the given reducer is returned as it is.
 * 
 * @example
 * 
 * const setValue = payload => ({
 *  type: "app/reducerA/SET_VALUE",
 *  payload
 * })
 * 
 * const scopedSetValue = scopeAction("reducerB", setValue)
 * 
 * const reducer = (state = 0, action) => action.type === "app/reducerA/SET_VALUE" ? action.payload : state
 * const scopedReducer = scopeReducer("reducerB", reducer)
 * 
 * // scoped reducer ignores unscoped action
 * console.log(scopedReducer(0, setValue(42)))
 * // 0
 * 
 * // scoped reducer handles scoped action
 * console.log(scopedReducer(0, scopedSetValue(42)))
 * // 42
 * 
 * @param {string} scope 
 * @param {function} reducer
 * @returns {function}
 */

const scopeReducer = (scope, reducer) =>
  scope && typeof reducer === "function"
    ? (state, action) => {
        const shouldProcessAction =
          action.meta &&
          action.meta.unscopedActionType &&
          isActionTypeScoped(scope, action.type);
        return shouldProcessAction
          ? reducer(state, { ...action, type: action.meta.unscopedActionType })
          : reducer(state, {});
      }
    : reducer;

export default scopeReducer;
