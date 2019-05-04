/**
 * Scope an action type.
 * <p>
 *  Replaces reducer in a duck complient action type with param scope".
 *  If not duck complient, the  given action type is returned unproccessed.
 * </p>
 * @example
 * const actionType = "app/reducerA/DO_STUFF";
 * console.log(scopeActionType("reducerB", actionType)); // app/reducerB/DO_STUFF
 * 
 * @param {string} scope the string that will replace the reducer part of the action type 
 * @param {string} actionType the action type that will be scoped
 * @returns {string} scoped action type
 */

const scopeActionType = (scope, actionType) => {
  const splittedActionType = actionType.split("/");
  if (splittedActionType.length < 3) return actionType;

  splittedActionType[1] = scope;
  return splittedActionType.join("/");
};

export default scopeActionType;
