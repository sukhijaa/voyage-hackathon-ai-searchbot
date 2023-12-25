import { argv } from 'process';
import fs from "fs";
import path, {dirname} from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = path.join(__dirname, "package.json")

const packageJsonStr = fs.readFileSync(packageJsonPath)
const packageJsonData = JSON.parse(packageJsonStr);
if (argv[2] === "1") {
    delete packageJsonData.type
} else {
    packageJsonData.type = "module"
}
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonData, null, 4))

