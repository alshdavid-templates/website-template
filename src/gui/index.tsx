import "./styles.css";
import { h, render } from "preact";

const worker = new Worker(globalThis.importMap.resolve("worker")!);

function App() {
  return <div>Hello World</div>;
}

render(<App />, document.body);
