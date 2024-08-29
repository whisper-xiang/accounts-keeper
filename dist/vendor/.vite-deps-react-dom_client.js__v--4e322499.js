import {
  require_react_dom
} from "/vendor/.vite-deps-chunk-CE7SSQE4.js__v--49533caf.js";
import "/vendor/.vite-deps-chunk-B7VAMJ3U.js__v--49533caf.js";
import {
  __commonJS
} from "/vendor/.vite-deps-chunk-5WRI5ZAA.js__v--49533caf.js";

// node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js"(exports) {
    var m = require_react_dom();
    if (false) {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function(c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function(c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});
export default require_client();
//# sourceMappingURL=react-dom_client.js.map
