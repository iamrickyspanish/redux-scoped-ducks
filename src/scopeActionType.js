const scopeActionType = (scope, actionType) => {
  const splittedActionType = actionType.split("/");
  if (splittedActionType.length < 3) return actionType;

  splittedActionType[1] = scope;
  return splittedActionType.join("/");
};

export default scopeActionType;
