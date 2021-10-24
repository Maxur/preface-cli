import { parse } from "./deps.ts";
import create from "./create.ts";

function displayHelp() {
  console.log(
    `Usage : ${import.meta.url.split("/").slice(-1)} <ACTION> [...ARGS]`,
  );
  console.log("Preface CLI");
  console.log("\thelp\tShow help");
  console.log("\tcreate");
  console.log("\t\t<PROJECT_NAME>\tCreate a new project");
}

function main(args: string[]) {
  const arg = parse(args);
  if (arg._.length === 0 || arg.help) {
    return displayHelp();
  }
  const [action, name] = arg._;
  switch (action) {
    case "create":
      create(name.toString());
      break;
    default:
      displayHelp();
      break;
  }
}

if (import.meta.main) {
  main(Deno.args);
}
