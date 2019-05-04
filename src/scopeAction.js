import scopeActionType from "./scopeActionType";

const scopeAction = (scope, action) => {
  switch (typeof action) {
    case "object":
      return {
        ...action,
        type: scopeActionType(scope, action.type),
        meta: { ...action.meta, unscopedActionType: action.type }
      };
    case "string":
      return {
        type: scopeActionType(scope, action),
        meta: {
          unscopedActionType: action
        }
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
