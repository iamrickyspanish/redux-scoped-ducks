import scopeDuck from "scopeDuck";

const importedDuck = {
  SET_VALUE: "app/reducerA/SET_VALUE",
  RESET: "app/reducerA/RESET",
  setValue: value => ({ type: "app/reducerA/SET_VALUE", payload: value }),
  reset: () => ({ type: "app/reducerA/RESET" }),
  default: (state = 0, action) =>
    action.type === "app/reducerA/SET_VALUE"
      ? action.payload
      : action.type === "app/reducerA/RESET"
      ? 0
      : state
};

describe("scopeDuck", () => {
  it("noop if given duck is not an object", () => {
    expect(scopeDuck("reducerB", "affe")).toBe("affe");
    expect(scopeDuck("reducerB", null)).toBe(null);
    expect(scopeDuck("reducerB", [1, 2, 3])).toMatchObject([1, 2, 3]);
  });

  it("noop if given duck has no reducer", () => {
    const { default: reducer, ...duckWithoutReducer } = importedDuck;
    expect(scopeDuck("reducerB", duckWithoutReducer)).toMatchObject(
      duckWithoutReducer
    );
  });

  describe("returned scoped duck", () => {
    const scopedDuck = scopeDuck("reducerB", importedDuck);

    it("correctly scopes all actionTypes (constants)", () => {
      expect(scopedDuck).toMatchObject({
        SET_VALUE: "app/reducerB/SET_VALUE",
        RESET: "app/reducerB/RESET"
      });
    });

    it("correctly scopes all action creators (functions)", () => {
      expect(scopedDuck.setValue(42)).toMatchObject({
        type: "app/reducerB/SET_VALUE",
        payload: 42
      });
      expect(scopedDuck.reset()).toMatchObject({
        type: "app/reducerB/RESET"
      });
    });

    it("correctly scopes the reducer (property 'default')", () => {
      expect(scopedDuck.default(0, scopedDuck.setValue(42))).toBe(42);
      expect(scopedDuck.default(0, importedDuck.setValue(42))).toBe(0);
      expect(scopedDuck.default(42, scopedDuck.reset())).toBe(0);
      expect(scopedDuck.default(42, importedDuck.reset())).toBe(42);
    });

    it("does not process anything else than action types (constants), action creators (functions) and the reducer (property 'default')", () => {
      const additionalData = {
        notAConstant: "app/reducer/action",
        anArray: [1, 2, 3],
        nothing: null,
        anObject: { a: 1, b: 2 },
        aNumber: 42
      };
      expect(
        scopeDuck("reducerB", {
          ...importedDuck,
          ...additionalData
        })
      ).toMatchObject({
        ...additionalData
      });
    });
  });
});
