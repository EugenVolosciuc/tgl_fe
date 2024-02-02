import type { Task } from '@/types';

const TASK_HEIGHT = 64; // px

export const getPositionAndSizeOfTask = (task: Task) => {
	// Horizontal positioning
	// Get the start and end columns
	const startCol = document.querySelector(`[data-date="${task.start_date}"]`)!;
	const endCol = document.querySelector(`[data-date="${task.end_date}"]`)!;
	const timeline = document.querySelector('#timeline')!;

	const { left: xStart } = startCol.getBoundingClientRect();
	const { right: xEnd } = endCol.getBoundingClientRect();
	const { left } = timeline.getBoundingClientRect();
	const { top: yStart } =
		timeline.children[0].children[1].getBoundingClientRect();

	console.log('timeline.children[0]', timeline.children[0]);
	console.log('yStart', yStart);

	// Vertical positioning

	return {
		left: xStart,
		width: xEnd - xStart,
		top: yStart,
		height: TASK_HEIGHT,
	};
};
