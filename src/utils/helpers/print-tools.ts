import kleur from "kleur";
import { spinner } from '@clack/prompts';


const checkmark = kleur.green("✔︎");
const xmark = kleur.red("ⅹ");
const warn = kleur.yellow("⚠︎");
/**
 * Print a blank line.
 */
function newline() {
  console.log("\n");
}

/**
 * Prints a divider line
 */
function divider() {
  console.log(
    kleur.yellow(
      "---------------------------------------------------------------",
    ),
  );
}


export function error(message: any, content?: any, legacy = false) {
  if (legacy) {
    console.log(kleur.red(message + " " + xmark));
    content && console.log(content);
  } else {
    const s = spinner();
    s.start(kleur.yellow(message));
    if (content) {
      s.stop(kleur.red(message + " " + xmark + "\n" + JSON.stringify(content, null, 2)), 1);
    } else {
      s.stop(kleur.red(message + " " + xmark), 1);
    }
  }
}


export function success(message: any, content?: any, legacy = false) {
  if (legacy) {
    console.log(kleur.green(message + " " + checkmark));
    content && console.log(content);
  } else {
    const s = spinner();
    s.start(kleur.yellow(message));
    if (content) {
      s.stop(kleur.cyan(message + +" " + checkmark + "\n" + JSON.stringify(content, null, 2)), 0);
    } else {
      s.stop(kleur.cyan(message + " " + checkmark), 0);
    }
  }
}

export function warning(message: any, content?: any, legacy = false) {
  if (legacy) {
    console.log(kleur.yellow(message));
    content && console.log(content);
  } else {
    const s = spinner();
    s.start(kleur.yellow(message));
    if (content) {
      s.stop(kleur.yellow(message + " " + warn + "\n" + JSON.stringify(content, null, 2)), 0);
    } else {
      s.stop(kleur.yellow(message + " " + warn), 0);
    }
  }
}

export function info(message: any, content?: any, legacy = false) {
  if (legacy) {
    console.log(kleur.yellow("---" + message + "--- "));
    content && console.log(content);
  } else {
    const s = spinner();
    s.start(kleur.yellow(message));
    if (content) {
      s.stop(kleur.yellow("---" + message + "--- " + "\n" + JSON.stringify(content, null, 2)), 0);
    } else {
      s.stop(kleur.yellow("--" + message + "--"), 0);
    }
  }

  // content && console.log(content);
}

function fancy(message: any): void {
  console.log(kleur.italic(message));
}

function stringify(message: any) {
  console.log(JSON.stringify(message, null, 2));
}
function debug(title = "DEBUG", message: any): void {
  const topLine = `vvv -----[ ${title} ]----- vvv`;
  const botLine = `^^^ -----[ ${title} ]----- ^^^`;

  console.log(kleur.magenta(topLine));
  console.log(message);
  console.log(kleur.magenta(botLine));
}

function highlight(message: string): void {
  console.log(kleur.bold(message));
}

function muted(message: string): void {
  console.log(kleur.bgCyan(message));
}



const printHelpers = {
  newline,
  divider,
  fancy,
  info,
  error,
  warning,
  debug,
  success,
  highlight,
  muted,
  checkmark,
  xmark,
  stringify,
};

export { printHelpers };
