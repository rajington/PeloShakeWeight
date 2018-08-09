import * as React from "react";
import { render } from "react-dom";
import ShakeWeight from "./ShakeWeight";

const App = () => (
  <ShakeWeight />
);

render(<App />, document.getElementById("root"));
