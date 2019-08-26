import 'prismjs';

import Springify from "../../dist/springify.esm.js";

import sailboatDemo from "./sailboatDemo.js";
import spiderDemo from "./spiderDemo.js";
import heliDemo from "./heliDemo.js";

heliDemo();
sailboatDemo();
spiderDemo();







const sigmoid = x => x / (1 + Math.abs(x * 0.01));
