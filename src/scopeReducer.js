export const isActionTypeScoped = (scope, actionType) => {
  const splittedActionType = actionType.split("/");
  if (splittedActionType.length < 3) {
    return actionType && actionType.slice(-scope.length - 1) === `_${scope}`;
  } else {
    return splittedActionType[1] === scope;
  }
};

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
