import { fileURLToPath } from 'node:url';
import { dirname, join, relative, extname } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

export default class Loader {
  modules: any[] = [];
  fileList = new Map<string, string>();

  constructor() {

  }

  async resolveView(viewName: string) {
    return this.fileList.get(`view/${viewName}`);
  }

  async resolve(moduleName: string) {
    const path = this.fileList.get(moduleName);
    return await import(path!);
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