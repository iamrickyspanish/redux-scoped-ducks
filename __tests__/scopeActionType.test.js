import scopeActionType from "scopeActionType";

describe("scopeActionType", () => {
  it("replaces reducer-part of duck complient action type with given scope", () => {
    expect(scopeActionType("reducerB", "app/reducerA/action")).toBe(
      "app/reducerB/action"
    );
  });

  it("returns the given action without proccessing if it is not duck complient", () => {
    expect(scopeActionType("reducerB", "affe")).toBe("affe");
  });
});
