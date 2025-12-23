import { fileURLToPath } from 'node:url';
import { dirname, join, relative, extname } from 'node:path';
import { readdirSync, statSync } from 'node:fs';
// @ts-ignore
import m1 from './modules/m1/classes/index.js';
// @ts-ignore
import m2 from './modules/m2/classes/index.js';

export class Main {
  modules: any[] = [];
  fileList = new Map<string, string>();

  constructor() {

  }

  addModule(module: any) {
    let path;
    if (module.filename) {
      path = dirname(fileURLToPath(module.filename));
    }
    this.modules.push({
      ...module,
      path
    });

    if (path) {
      this.scanDir(path, path);
    }
  }

  scanDir(basePath: string, currentPath: string) {
    const files = readdirSync(currentPath);
    for (const file of files) {
      const fullPath = join(currentPath, file);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        this.scanDir(basePath, fullPath);
      } else {
        if (file.startsWith('.') || file.startsWith('index.')) continue;
        const ext = extname(file);
        const relativePath = relative(basePath, fullPath);
        const normalizedPath = relativePath.split('\\').join('/');
        const key = normalizedPath.slice(0, -ext.length);
        this.fileList.set(key, fullPath);
      }
    }
  }

  addModules(modules: any[]) {
    modules.forEach(m => this.addModule(m));
  }
}

if (import.meta.main) {
  const main = new Main()
  main.addModules([m1, m2]);

  console.log(main.modules);
  console.log(main.fileList);
}
