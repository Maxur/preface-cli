import config from "./config.ts";

const readme = (title: string) =>
  `# ${title}

## Launch development

\`\`\`sh
deno bundle --watch -c tsconfig.json src/index.ts dist/index.js
\`\`\`
`;

const tsConfig = () =>
  `{
  "compilerOptions": {
    "lib": ["dom", "esnext"],
    "jsx": "react",
    "jsxFactory": "JSX.h",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
`;

const indexHtml = (title: string) =>
  `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="./dist/index.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;

const deps = () =>
  `export {
  cached,
  Component,
  createApplication,
  JSX,
  reactive,
  watch,
} from "${config.cdn.main}";
`;

const style = () =>
  `export default \`
body {
  font-family: sans-serif;
  margin: 0;
}
.main {
  background-color: #f0f0f0;
  margin: 1rem;
  padding: 1rem;
}
.block {
  background-color: #e8e8e8;
  padding: 1rem;
}
button, input {
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
}
button:hover, input:hover {
  background-color: #f8f8f8;
}
\`;
`;

const indexTs = () =>
  `import { createApplication } from "./deps.ts";
import Main from "./components/Main/mod.ts";
import style from "./style.ts";

createApplication(Main, style).then((ci) => {
  ci.mount("#app");
});
`;

const componentController = () =>
  `import { cached, Component, reactive } from "../../deps.ts";

export default new Component(() => {
  const text = reactive("This is an example text");
  const textLower = cached(() => {
    return text.value.toLowerCase();
  });
  const textUpper = cached(() => {
    return text.value.toUpperCase();
  });
  const textChange = (event: Event) => {
    if (event && event.target) {
      text.value = (event.target as HTMLInputElement).value;
    }
  };
  const count = reactive(0);
  return {
    text,
    textLower,
    textUpper,
    textChange,
    count,
  };
});
`;

const componentTemplate = () =>
  `import { JSX } from "../../deps.ts";
import controller from "./controller.ts";

export default controller.render((state) => {
  return (
    <div class="main">
      <h1>Preface</h1>
      <div class="block">
        <h2>Reactivity</h2>
        <input type="text" value={state.text} $input={state.textChange} />
        &nbsp;(length: {state.text.length})
        <br /><br />
        Lower case : {state.textLower}
        <br /><br />
        Upper case : {state.textUpper}
      </div>
      <br />
      <div class="block">
        <h2>Button count</h2>
        <button type="button" $click={() => (state.count += 1)}>
          Number of Click{state.count > 1 && "s" || ""} : {state.count}
        </button>&nbsp;
        <button type="button" $click={() => (state.count = 0)}>
          Reset
        </button>
      </div>
    </div>
  );
});
`;

const componentMod = () =>
  `import template from "./template.tsx";
export default template.end();
`;

export default function create(workspace: string) {
  try {
    Deno.mkdirSync(workspace);
    Deno.mkdirSync(`${workspace}/dist`);
    Deno.mkdirSync(`${workspace}/src`);
    Deno.mkdirSync(`${workspace}/src/components`);
    Deno.mkdirSync(`${workspace}/src/components/Main`);
    Deno.writeTextFileSync(`${workspace}/README.md`, readme(workspace));
    Deno.writeTextFileSync(`${workspace}/tsconfig.json`, tsConfig());
    Deno.writeTextFileSync(`${workspace}/index.html`, indexHtml(workspace));
    Deno.writeTextFileSync(`${workspace}/src/deps.ts`, deps());
    Deno.writeTextFileSync(`${workspace}/src/style.ts`, style());
    Deno.writeTextFileSync(`${workspace}/src/index.ts`, indexTs());
    Deno.writeTextFileSync(
      `${workspace}/src/components/Main/controller.ts`,
      componentController(),
    );
    Deno.writeTextFileSync(
      `${workspace}/src/components/Main/template.tsx`,
      componentTemplate(),
    );
    Deno.writeTextFileSync(
      `${workspace}/src/components/Main/mod.ts`,
      componentMod(),
    );
    console.log(`Project created : ${workspace}`);
  } catch (e) {
    console.error(e.message);
  }
}
