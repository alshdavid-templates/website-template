import "./styles.css";
import { h, render } from "preact";

new Worker(globalThis.importMap.resolve("worker")!, {
  type: "module",
});

function App() {
  return (
    <div>
      <h1>Website Template</h1>
      <p>Basic starter template for bundled websites using Preact</p>
      <p>
        <b>It Features;</b>
      </p>
      <ul>
        <li>Rspack bundler</li>
        <li>TypeScript</li>
        <li>Preact</li>
        <li>CSS Modules/Nesting</li>
        <li>Web Workers</li>
        <li>Bundle Size Stats</li>
        <li>Workflow to publish to GitHub Pages</li>
        <li>
          Template distributes 5kb of content (Preact, CSS, Worker + App code)
        </li>
      </ul>
      <div>
        <a href="https://github.com/alshdavid-templates/website-template">
          GitHub Repo
        </a>
      </div>
    </div>
  );
}

render(<App />, document.body);
