import { describe, it, expect } from 'bun:test';
import { Main } from '../loader';
// @ts-ignore
import m1 from '../modules/m1/classes/index';
// @ts-ignore
import m2 from '../modules/m2/classes/index';

describe('Loader', () => {
  it('should load modules', () => {
    const main = new Main();
    main.addModules([m1, m2]);
    expect(main.modules.length).toBe(2);
    expect(main.modules[0].configs).toEqual(['m1']);
  });

  it('should populate fileList', () => {
    const main = new Main();
    main.addModules([m1, m2]);
    expect(main.fileList.size).toBeGreaterThan(0);
    expect(main.fileList.has('config/m1')).toBe(true);
    expect(main.fileList.has('controller/Home')).toBe(true);
  });

  it('should override files from later modules', () => {
    const main = new Main();
    main.addModules([m1, m2]);
    
    const configPath = main.fileList.get('config/m1');
    // m2 should override m1
    // We check if the path contains 'modules/m2'
    expect(configPath?.replace(/\\/g, '/')).toContain('modules/m2');
  });

  it('should respect order of modules', () => {
    const main = new Main();
    // Add m2 then m1. m1 should override m2.
    main.addModules([m2, m1]);
    
    const configPath = main.fileList.get('config/m1');
    expect(configPath?.replace(/\\/g, '/')).toContain('modules/m1');
  });
});
