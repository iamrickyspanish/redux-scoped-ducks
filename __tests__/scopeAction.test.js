import scopeAction from "scopeAction";

describe("scopeAction", () => {
  describe("argument was of type string: create scoped action from action type", () => {
    it("correctly creates action from action type", () => {
      expect(scopeAction("reducerB", "app/reducerA/action")).toMatchObject({
        type: "app/reducerB/action",
        meta: {
          unscopedActionType: "app/reducerA/action"
        }
      });
    });
    it("returns action object with unscoped action type if action type is not duck complient", () => {
      const scopedAction = scopeAction("reducerB", "affe")
      expect(scopedAction).toMatchObject({
        type: "affe",
      });
      expect(scopedAction.meta).toBeUndefined()
    });
  });

  describe("argument was of type function: create scoped action creator", () => {
    it("returns action creator that correctly creates an scoped action", () => {
      expect(
        scopeAction("reducerB", () => ({ type: "app/reducerA/action" }))()
      ).toMatchObject({
        type: "app/reducerB/action",
        meta: {
          unscopedActionType: "app/reducerA/action"
        }
      });
    });

    it("returned action creator does not mutate the original action creator's meta data other than adding the 'unscopedActionType' property", () => {
      const scopedAction = scopeAction("reducerB", () => ({
        type: "app/reducerA/action",
        meta: { foo: "bar" }
      })) 
      expect(
        scopedAction()
      ).toMatchObject({
        type: "app/reducerB/action",
        meta: {
          unscopedActionType: "app/reducerA/action",
          foo: "bar"
        }
      });
    });

    it("returned action creator does not interfere with the original action creators logic", () => {
      expect(
        scopeAction("reducerB", (var1, var2) => ({
          type: "app/reducerA/action",
          payload: var1,
          meta: { foo: "bar", var2 }
        }))(42, "affe")
      ).toMatchObject({
        type: "app/reducerB/action",
        payload: 42,
        meta: {
          unscopedActionType: "app/reducerA/action",
          foo: "bar",
          var2: "affe"
        }
      });
    });

    it("returns action creator as it was received if action type of computed action object is not duck complient", () => {
      const scopedAction = scopeAction("reducerB", payload => ({
        type: "affe",
        payload,
        meta: { foo: "bar" }
      }))
      expect(
        scopedAction(42)
      ).toMatchObject({
        type: "affe",
        payload: 42,
        meta: { foo: "bar" }
      });
      expect(scopedAction(42).meta.unscopedActionType).toBeUndefined()
    });
  });

  describe("argument was of action object: scope action object ", () => {
    it("correctly scopes an action object", () => {
      expect(
        scopeAction("reducerB", {
          type: "app/reducerA/action"
        })
      ).toMatchObject({
        type: "app/reducerB/action",
        meta: {
          unscopedActionType: "app/reducerA/action"
        }
      });
    });

    it("does not mutate the original action object's meta data other than adding the 'unscopedActionType' property", () => {
      expect(
        scopeAction("reducerB", {
          type: "app/reducerA/action",
          meta: { foo: "bar" }
        })
      ).toMatchObject({
        type: "app/reducerB/action",
        meta: {
          unscopedActionType: "app/reducerA/action",
          foo: "bar"
        }
      });
    });

    it("returns action object as it was received if its action type is not duck complient", () => {
      expect(
        scopeAction("reducerB", {
          type: "affe",
          payload: 42,
          meta: { foo: "bar" }
        })
      ).toMatchObject({
        type: "affe",
        payload: 42,
        meta: { foo: "bar" }
      });
    });
  });
});
