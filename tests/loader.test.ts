import { describe, it, expect } from 'bun:test';
import CascadeFileLoader from '../loader';
// @ts-ignore
import m1, {ControllerHome, ControllerFoo} from '../modules/m1/classes/index';
// @ts-ignore
import m2, {ControllerHome as ControllerHome2} from '../modules/m2/classes/index';

describe('Loader', () => {
  it('should populate fileList', () => {
    const main = new CascadeFileLoader();
    main.addModules([m1, m2]);
    expect(main.fileList.size).toBeGreaterThan(0);
    expect(main.fileList.has('config/m1')).toBe(true);
    expect(main.fileList.has('controller/Home')).toBe(true);
  });

  it('should override files from later modules', () => {
    const main = new CascadeFileLoader();
    main.addModules([m1, m2]);
    
    const configPath = main.fileList.get('config/m1');
    // m2 should override m1
    // We check if the path contains 'modules/m2'
    expect(configPath?.replace(/\\/g, '/')).toContain('modules/m2');
  });

  it('should respect order of modules', () => {
    const main = new CascadeFileLoader();
    // Add m2 then m1. m1 should override m2.
    main.addModules([m2, m1]);
    
    const configPath = main.fileList.get('config/m1');
    expect(configPath?.replace(/\\/g, '/')).toContain('modules/m1');
  });

  it('should resolve module paths', async () => {
    const main = new CascadeFileLoader(['.', 'index.', 'init.']);
    main.addModules([m1, m2]);
    
    const path = await main.resolve('controller/Foo');
    expect(path).toBeDefined();
    expect(path?.replace(/\\/g, '/')).toContain('m1/classes/controller/Foo.mjs');

    const path2 = await main.resolve('controller/Home');
    expect(path2).toBeDefined();
    expect(path2?.replace(/\\/g, '/')).toContain('m2/classes/controller/Home.mjs');

    const path3 = await main.resolve('config/m2');
    expect(path3).toBeDefined();
    expect(path3?.replace(/\\/g, '/')).toContain('m2/classes/config/m2.mjs');
  });

  it('import test', async () => {
    const main = new CascadeFileLoader();
    main.addModules([m1, m2]);
    
    const path = await main.resolve('controller/Foo');
    const ControllerFooImport = await import(path!);
    expect(ControllerFooImport).toBeDefined();
    expect(ControllerFooImport.default).toBe(ControllerFoo);

  });
});
