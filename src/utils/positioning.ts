import type { Task } from '@/types';

const TASK_HEIGHT = 64; // px

const isElementWithAttributeBetweenXCoordinates = (
	xStart: number,
	xEnd: number
) => {
	const elementsWithAttribute = document.querySelectorAll(`[data-taskid]`);

	for (const element of elementsWithAttribute) {
		const rect = element.getBoundingClientRect();
		const elementLeft = rect.left;
		const elementRight = rect.right;

		// Check if the element is between xStart and xEnd
		if (elementLeft >= xStart && elementRight <= xEnd) {
			return element;
		}
	}

	return null;
};

export const getPositionAndSizeOfTask = (task: Task, allTasks: Task[]) => {
	// Horizontal positioning
	// Get the start and end columns
	const startCol = document.querySelector(`[data-date="${task.start_date}"]`)!;
	const endCol = document.querySelector(`[data-date="${task.end_date}"]`)!;
	const timeline = document.querySelector('#timeline')!;

	const { left: xStart } = startCol.getBoundingClientRect();
	const { right: xEnd } = endCol.getBoundingClientRect();
	const { left } = timeline.getBoundingClientRect(); // TODO
	const { top: yStart } =
		timeline.children[0].children[1].getBoundingClientRect();

	// Vertical positioning
	let rowIndex = 0;
	let taskToPosition = task;
	// First position them one-by-one based on weight, even if they overlap, then use some DOM checking or some other logic

	// Attempt to position on the first row.  Do this recursively until no task is present.
	// If there is already a task in this task's interval AND the overlapped task has a  - check the next row.
	// if (there is already a task in this task's interval) {
	//    if (this task has a weight lower than the overlapped task) {
	//          should replace tasks
	//    } else check next row
	// } else put task in current row
	console.log('task.weight', task.name, task.weight);

	return {
		left: xStart,
		width: xEnd - xStart,
		top: yStart,
		height: TASK_HEIGHT,
	};
};
