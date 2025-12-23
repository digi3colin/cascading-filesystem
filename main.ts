import Loader from './loader';
import m1 from './modules/m1/classes/index.js';
import m2 from './modules/m2/classes/index.js';


if (import.meta.main) {
  const main = new Loader()
  main.addModules([m1, m2]);

  console.log(main.modules);
  console.log(main.fileList);
}
