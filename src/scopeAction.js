import scopeActionType from "./scopeActionType";

/**
 * Scopes an action creator/object/type.
 * 
 * the given action can be an action creator/object/type.
 * <p>
 *  The given action is a string: will be treated as action type.
 *  `scopeAction` will return an action object wich will contain the scoped action type aswell as some meta data.
 *  If not duck complient, the action type of the returned action object will remain unscoped and no meta data will be added
 * </p>
 * <p>
 *  The given action is an object: will be treated as action object.
 *  `scopeAction` will modify the object by scoping its action type aswell as adding some meta data.
 *   If not duck complient, the action object will be returned as it is.
 * </p>
 * <p>
 *  The given action is a function: will be treated as action creator.
 * `scopeAction` will return an action creator that will return the output of the given action creator but scopes the action type aswell as adding some meta data.
 *  If not duck complient, the given action creator will be returned as it is.
 * </p>
 * @example
 * // basic usage
 * ...
 * const scopedAction = scopeAction("reducerB", action)
 * 
 * // given action is an action type
 * const action = "app/reducerA/DO_STUFF";
 * 
 * console.log(scopeAction("reducerB", action));
 * // { 
 * //   type: "app/reducerB/DO_STUFF",
 * //   meta: { 
 * //     unscopedActionType: "app/reducerA/DO_STUFF" 
 * //   }
 * // }
 * 
 * // given action is an action object
 * const action = { 
 *  type: "app/reducerA/DO_STUFF",
 *  payload: 42
 * };
 * 
 * console.log(scopeAction("reducerB", action));
 * // { 
 * //   type: "app/reducerB/DO_STUFF",
 * //   payload: 42,
 * //   meta: {
 * //     unscopedActionType: "app/reducerA/DO_STUFF"
 * //   }
 * // }
 * 
 * // given action is an action creator
 * const action = payload => ({ type: "app/reducerA/DO_STUFF", payload })
 * console.log(action(42))
 * // {
 * //   type: "app/reducerA/DO_STUFF",
 * //   payload: 42
 * // }
 * const scopedAction = scopeAction("reducerB", action)
 * console.log(scopedAction(42));
 * // {
 * //   type: "app/reducerB/DO_STUFF",
 * //   payload: 42,
 * //   meta: {
 * //     unscopedActionType: "app/reducerA/DO_STUFF"
 * //   }
 * // }
 * 
 * @param {string} scope the scope: will replace the reducer part of the actions action type
 * @param {string|object|function} action the action (type/object/creator) that will be scoped
 * @returns {object|function} scoped action object or action creator
 */


const scopeAction = (scope, action) => {
  switch (typeof action) {
    case "object":
      return {
        ...action,
        type: scopeActionType(scope, action.type),
        meta: scopeActionType(scope, action.type) !== action.type
          ? { ...action.meta, unscopedActionType: action.type }
          : action.meta
      };
    case "string":
      return {
        type: scopeActionType(scope, action),
        meta: scopeActionType(scope, action) !== action ? {
          unscopedActionType: action
        } : undefined
      };
    case "function":
      return (...args) => {
        const actionObject = action(...args);
        const scopedActionType = scopeActionType(scope, actionObject.type);
        return scopedActionType === actionObject.type
          ? actionObject
          : {
              ...actionObject,
              type: scopedActionType,
              meta: {
                ...actionObject.meta,
                unscopedActionType: actionObject.type
              }
            };
      };
    default:
      return action;
  }
};

export default scopeAction;
