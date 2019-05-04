import scopeReducer from "scopeReducer";
import scopeAction from "scopeAction";

describe("scopeReducer", () => {
  it("noop if given reducer is not a function", () => {
    expect(scopeReducer("reducerB", 42)).toBe(42);
  });

  describe("returned scoped reducer", () => {
    const setValueUnscoped = value => ({
      type: "app/reducerA/SET_VALUE",
      payload: value
    });

    const setValueScoped = scopeAction("reducerB", setValueUnscoped);

    const scopedReducer = scopeReducer("reducerB", (state = 0, action) =>
      action.type === "app/reducerA/SET_VALUE" ? action.payload : state
    );

    it("handles scoped action", () => {
      expect(scopedReducer(0, setValueScoped(42))).toBe(42);
    });

    it("ignores out of scope action", () => {
      expect(scopedReducer(0, setValueUnscoped(42))).toBe(0);
    });
  });
});
