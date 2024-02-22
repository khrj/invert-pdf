import { execa } from "execa"
import { readdir } from "fs/promises"
import Bottleneck from "bottleneck"

const input_dir = "INPUT_DIR"

const limiter = new Bottleneck({ maxConcurrent: 6 })
const files = (await readdir(input_dir)).filter(f => f.endsWith(".pdf"))

await Promise.all(
	files.map(f =>
		limiter.schedule(async () => {
			console.log("Starting a task...")

			await execa("node", [
				"src/convert.js",
				`${input_dir}/${f}`,
				`outputs/${f}`,
			])

			console.log("Progress!")
		})
	)
)
