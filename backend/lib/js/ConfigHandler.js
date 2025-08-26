import { parse } from "yaml";
import * as fs from "fs";

/** Class to handle the configuration file. */
export class ConfigHandler {
    #data;

   /**
    * @constructor
    * @param {string} path - The path to the YAML configuration file to process
    */
    constructor(path = "config.yml") {
        const content = fs.readFileSync(path, { encoding: "utf8" });
        this.#data = parse(content);
    }

    get(...keyParts) {
        return keyParts.reduce((obj, keyPart) => obj[keyPart], this.#data);
    }
}