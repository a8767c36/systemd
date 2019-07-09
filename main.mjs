#!/usr/bin/node --experimental-modules

import YAML from 'yaml';
import {default as fsWithCallbacks} from 'fs'
const fs = fsWithCallbacks.promises

main().catch(console.error);

async function main() {
	const filename = process.argv[2];
	const yaml = (await fs.readFile(filename)).toString();
	const config = YAML.parse(yaml);

	const statusMap = { };
	const todo = Object.keys(config);
	while (true) {
		while (todo.length) {
			let id = todo.shift();
			let service = config[id];
			let deps = service.dependsOn || [ ];
			if (typeof deps == 'string') deps = [deps];
			if (!deps.every(x => x in statusMap)) {
				// unmet dependencies
				todo.push(id);
				continue;
			}
			console.log(`Starting "${service.name}" with command '${service.cmdline}'`);
			// TODO: actually start
			statusMap[id] = { running: true };
		}
		await new Promise(f => setTimeout(f, 1000));
	}
}


