import { ConfirmOptions, SelectOptions, TextOptions, text,MultiSelectOptions } from '@clack/prompts';
import { confirm } from '@clack/prompts';
import { select } from '@clack/prompts';
import { multiselect } from '@clack/prompts';

export function textPrompt(opts: TextOptions) {
    return text(opts) as Promise<string>
}

export function confirmPrompt(opts:ConfirmOptions) {
    return confirm(opts) as Promise<boolean>
}

export function selectPrompt(opts: SelectOptions<{ value:string; label: string; hint?: string | undefined; }[], string>) {
    return select(opts) as Promise<string>
}

// 
export function multiselectPrompt<T>(opts: MultiSelectOptions<{ value:T; label: string; hint?: string | undefined; }[], any>) {
    return multiselect(opts) as any as Promise<string>
}
