import { promises as fs } from 'node:fs';
import { defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
  setup(opts, nuxt) {
    nuxt.hook('imports:context', async (ctx) => {
      const imports = await ctx
        .getImports()
        .then(r => r.filter(i => !i.type));
      const eslintConfigs = { globals: {} };
      imports
        .map(i => i.as ?? i.name)
        .filter(Boolean)
        .sort()
        .forEach((name) => {
          eslintConfigs.globals[name] = true;
        });
      const jsonBody = JSON.stringify(eslintConfigs, null, 2);
      await fs.writeFile('eslintrc.json', jsonBody);
    });
  },
});