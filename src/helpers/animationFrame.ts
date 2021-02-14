export const animationFrame = () =>
	new Promise<number>((resolve) => requestAnimationFrame(resolve))
