import { Clock } from "./Clock"
import { gameLoop } from "./helpers/gameLoop"
import { loadImage } from "./helpers/loadImage"
import { randomRange } from "./helpers/randomRange"

// from https://thenounproject.com/term/maple-leaf/57440/ ♥
const leafImage = document.createElement("canvas")
leafImage.width = leafImage.height = 100

// create a new recolored image
loadImage(
	`data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczphPSJodHRwOi8vbnMuYWRvYmUuY29tL0Fkb2JlU1ZHVmlld2VyRXh0ZW5zaW9ucy8zLjAvIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSItMTguOTM5IC05LjQzNyAxMDAgMTAwIiBvdmVyZmxvdz0idmlzaWJsZSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAtMTguOTM5IC05LjQzNyAxMDAgMTAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNNTkuNDQzLDM2Ljg2NWMtMi40OTQtMS4yODQtMS41MTMtMy4zMjUtMS41MTMtMy4zMjVsMi40MzgtOS45NTljMCwwLTQuNzc5LDEuMTk1LTcuNSwxLjggIGMtMi43MjEsMC42MDQtMi41NjgtMS41MS0yLjU2OC0xLjUxbC0xLjM2MS0zLjQ3OGMwLDAtNS4yODksNy40MDgtNi4wNjUsOC4xNjVjLTAuNzc3LDAuNzU3LTEuNDg4LDEuMjE2LTIuNTQ2LDAuOTEyICBjLTEuMDU4LTAuMzAzLTAuNjAxLTIuMTA5LTAuNjAxLTIuMTA5bDMuMDM3LTE3Ljk3YzAsMCwxLjA4LTEuMTc5LTIuODQ5LDEuNTQzYy0zLjkzLDIuNzIxLTQuNDI0LTEuMTQ0LTQuNDI0LTEuMTQ0bC00LjQzMS05Ljc4N1YwICBsLTQuNjY4LDkuNzkxYzAsMC0wLjY0MywzLjg2NC00LjU3MywxLjE0NGMtMy45MzItMi43MjItMi44OTItMS41NDMtMi44OTItMS41NDNsMy4wMTQsMTcuOTdjMCwwLDAuNDQ2LDEuODA3LTAuNjExLDIuMTA5ICBjLTEuMDU4LDAuMzA0LTEuNzczLTAuMTU1LTIuNTUxLTAuOTEyYy0wLjc3NS0wLjc1Ny02LjA3LTguMTY1LTYuMDctOC4xNjVsLTEuMzU5LDMuNDc4YzAsMCwwLjE1LDIuMTEzLTIuNTcsMS41MSAgYy0yLjcyMi0wLjYwNC03LjUwMS0xLjgtNy41MDEtMS44bDIuNDM4LDkuOTU5YzAsMCwwLjk4MSwyLjA0MS0xLjUxMywzLjMyNXMtMi4xOTEsMS4yODQtMi4xOTEsMS4yODRsMTQuMzYxLDEzLjMwNCAgYzAsMCwxLjQzNiwxLjY2MiwwLjQ1NCw0LjY4NmMtMC45ODMsMy4wMjQtMC41MywyLjk3OS0wLjQ1NCwzLjI4MmMwLjA3NSwwLjMwMywxMS4yNjItMS44NTcsMTMuOTgyLTEuODU3YzAuMjk2LDAsMC43MDUsMCwwLjcwNSwwICB2MThoMS44ODdsMC45MDctMThjMC4zNDIsMCwwLjc5NywwLDEuNDM3LDBjMi43MjIsMCwxMy45MDgsMi4xNiwxMy45ODIsMS44NTdjMC4wNzYtMC4zMDMsMC41My0wLjIyMy0wLjQ1My0zLjI0NyAgYy0wLjk4MS0zLjAyMywwLjQ1My00LjcwMywwLjQ1My00LjcwM2wxNC4zNjEtMTMuMzEyQzYxLjYzNSwzOC4xNTgsNjEuOTM4LDM4LjE0OSw1OS40NDMsMzYuODY1eiI+PC9wYXRoPjwvc3ZnPg==`,
).then((image) => {
	const context = leafImage.getContext("2d")!

	context.drawImage(image, 0, 0, leafImage.width, leafImage.height)

	context.globalCompositeOperation = "source-atop"
	context.fillStyle = "white"
	context.fillRect(0, 0, leafImage.width, leafImage.height)
})

const canvas = document.querySelector("canvas")!
const context = canvas.getContext("2d")!

type Sprite = {
	x: number // 0-1
	y: number // 0-1
	size: number // 0-1
}

const sprites = new Set<Sprite>()
const spriteSpawnClock = new Clock(0.3)

function fixCanvasSize() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}

function update(dt: number) {
	if (dt > 0.5) return

	if (spriteSpawnClock.update(dt)) {
		sprites.add({
			x: randomRange(0, 1),
			y: -0.1,
			size: randomRange(0.3, 1),
		})
	}

	for (const sprite of sprites) {
		sprite.y += dt * (1 / 20 + sprite.size / 20)
		if (sprite.y > 1.1) {
			sprites.delete(sprite)
		}
	}
}

function drawDiamond(x: number, y: number, size: number) {
	context.save()

	context.translate(x, y)
	context.rotate(Math.PI * 0.25)
	context.translate(-size / 2, -size / 2)

	context.fillRect(0, 0, size, size)

	context.restore()
}

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height)
	context.fillStyle = "white"

	for (const sprite of sprites) {
		const x = sprite.x * canvas.width
		const y = sprite.y * canvas.height

		context.save()

		context.translate(x + Math.sin((sprite.y + sprite.size) * 10) * 50, y)
		context.scale(sprite.size, sprite.size)
		context.rotate(Math.sin(sprite.y * 20) / 3)
		context.translate(-leafImage.width / 2, -leafImage.height / 2)
		context.globalAlpha = 0.3
		context.shadowBlur = 4
		context.shadowColor = "white"

		context.drawImage(leafImage, 0, 0)

		context.restore()
	}
}

function runFrame(dt: number) {
	update(dt)
	draw()
}

async function main() {
	window.addEventListener("resize", fixCanvasSize)
	fixCanvasSize()

	for await (const delta of gameLoop()) {
		runFrame(delta / 1000)
	}
}

main().catch(console.error)
