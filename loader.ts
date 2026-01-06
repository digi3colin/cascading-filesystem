import { fileURLToPath } from 'node:url';
import { dirname, join, relative, extname } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

export default class CascadeFileLoader {
  public fileList = new Map<string, string>();
  private ignoreList: RegExp[];

  constructor(ignoreList: RegExp[] = [/^(index|init)\./]) {
    this.ignoreList = ignoreList;
  }

  resolve(moduleName: string) {
    return this.fileList.get(moduleName);
  }

  addModule(module: any) {
    if(!module) return;
    const m = module.default || module;
    if (!m.filename)return;

    const path = dirname(fileURLToPath(m.filename));

    const classesPath = join(path, 'classes');
    try {
        if(statSync(classesPath).isDirectory()){
            this.scanDir(classesPath);
        } else {
            this.scanDir(path);
        }
    } catch(e) {
        this.scanDir(path);
    }
  }

  private scanDir(basePath: string, currentPath: string = "") {
    if (!currentPath) currentPath = basePath;

    try {
      const files = readdirSync(currentPath);
      for (const file of files) {
        const fullPath = join(currentPath, file);
        const stat = statSync(fullPath);
          if (stat.isDirectory()) {
            this.scanDir(basePath, fullPath);
          } else {
            for (const ignore of this.ignoreList) {
              if (ignore.test(file))continue;
            }

          const ext = extname(file);
          const relativePath = relative(basePath, fullPath);
          const normalizedPath = relativePath.split('\\').join('/');
          const key = normalizedPath.slice(0, -ext.length);
          this.fileList.set(key, fullPath);
        }
      }
    } catch (e) {
      console.log(`Error scanning directory ${currentPath}:`, e);
    }
  }

  addModules(modules: any[]) {
    modules.forEach(m => this.addModule(m));
  }
}