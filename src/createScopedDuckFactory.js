import scopeDuck from "./scopeDuck";

const createScopedDuckFactory = duck => scope => scopeDuck(scope, duck);

export default createScopedDuckFactory;
