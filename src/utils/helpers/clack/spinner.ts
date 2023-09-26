import kleur from "kleur";
import { spinner } from '@clack/prompts';
import { printHelpers } from "../print-tools";

export function loadingSpinner() {
    const s = spinner();


    return {

        add: (id = "start", { text = "working..." }) => {
            s.start(kleur.yellow(text));
        },

        succeed: (id = "succeed", { text = "task success" }) => {
            s.stop(kleur.cyan(text) + printHelpers.checkmark, 0);
        },

        fail: (id = "fail", { text = "task fail" }) => {
            s.stop(kleur.red(text), 1) + printHelpers.xmark;
        },

        print_success: (id = "print_succeed", { text = "task success" }) => {
            s.start(kleur.yellow(text));
            s.stop(kleur.cyan(text) + printHelpers.checkmark, 0);
        },

        print_error: (id = "print_fail", { text = "task fail" }) => {
            s.start(kleur.yellow(text));
            s.stop(kleur.red(text) + printHelpers.xmark, 1);
        }
    }
}
