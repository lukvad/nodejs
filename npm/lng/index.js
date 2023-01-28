import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { franc } from "franc";
const langs = require('langs');
const code = franc(process.argv[2])
console.log(code);
// if (code === 'und') {
//     console.log("Sorry not enough text to define language!");
// } else {
//     console.log(langs.where("3", code).name)
// }