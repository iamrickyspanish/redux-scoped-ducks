import scopeDuck from "./scopeDuck";

/**
 * Creates a function thas can scope a given duck.
 * 
 * <p>
 *  Takes a duck and returns a function that is able to create scoped versions of the given duck.
 * </p>
 * 
 * @example
 * 
 * import * as counterDuck from "src/counter/duck"
 * import { createScopedDuckFactory } from "redux-scoped-ducks"
 * 
 * // create a factory for counter duck
 * export const counterDuckFactory = createScopedDuckFactory(counterDuck)
 *  
 * // now you can use the factory to create multiple versions of the counter duck, and therfore its whole redux logic, that are scoped and do not interfere with each other 
 * const counterADuck = counterDuckFactory("counterA")
 * const counterBDuck = counterDuckFactory("counterB")
 * 
 * @param {object} duck
 * @returns {function} duck factory - a function that takes a scope and returns a scoped version of the given duck  
 */

const createScopedDuckFactory = duck => scope => scopeDuck(scope, duck);

export default createScopedDuckFactory;
