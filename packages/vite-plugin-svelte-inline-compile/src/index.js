import { transformSync } from '@babel/core';
import svelteInlineCompileBabelPlugin from 'babel-plugin-svelte-inline-compile';
const virtualModuleId = 'svelte-inline-compile';
const resolvedVirtualModuleId = '\0' + virtualModuleId;
const defaultFileRegex = /\.(test|spec)\.[tj]s$/;

export default function myPlugin(config={}) {
  const fileRegex = config.fileRegex || defaultFileRegex;

  return {
    name: 'svelte-inline-compile',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return '';
      }
    },
    transform(src, id) {
      if (fileRegex.test(id)) {
        return transformSync(src, {
          plugins: [
            svelteInlineCompileBabelPlugin
          ],
          ast: true,
          sourceMaps: true,
          sourceFileName: id
        });
      }
    }
    // TODO: Investigate if moduleParsed can improve performance.
  }
}
