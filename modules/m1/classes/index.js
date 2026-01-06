export default {
    filename: import.meta.url,
    configs: ['m1']
};
import ControllerFoo from './controller/Foo.mjs';
import ControllerHome from './controller/Home.mjs';
export { 
    ControllerHome, 
    ControllerFoo
};
