import type { SvelteComponentDev } from "svelte/internal";

declare function svelte(input: TemplateStringsArray): typeof SvelteComponentDev;
export = svelte;
