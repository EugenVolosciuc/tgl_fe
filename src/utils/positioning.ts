import type { Task } from '@/types';
import dayjs from 'dayjs';
import { checkDateRangesOverlap } from './date-utils';

export const TASK_HEIGHT = 64; // px

export const isElementBetweenXCoordinates = (xStart: number, xEnd: number) => {
	const elements = document.querySelectorAll(`[data-taskid]`);

	for (const element of elements) {
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

/**
 * Get the task rows, each including the task it should have
 * @param tasks Tasks sorted by weight in descending order
 * @returns `Task['id'][][]`
 */
// export const createTaskRows = (tasks: Task[]) => {
// 	let rows: Task[][] = [[]];

// 	for (let t = 0; t < tasks.length; t++) {
// 		const checkedTask = tasks[t];
// 		for (let r = 0; r < rows.length; r++) {
// 			// Row is empty, we can surely add a task here
// 			if (rows[r].length === 0) {
// 				rows[r].push(checkedTask);
// 				console.log('row was empty, added task');
// 			} else {
// 				// Go through the tasks in this row and check if there are any tasks that have an overlapping interval
// 				// If they overlap, check the next row
// 				const cannotPlaceTaskInRow = rows[r].some((task) =>
// 					checkDateRangesOverlap(
// 						dayjs(task.start_date),
// 						dayjs(task.end_date),
// 						dayjs(checkedTask.start_date),
// 						dayjs(checkedTask.end_date)
// 					)
// 				);

// 				console.log('checkedTask', checkedTask);
// 				console.log('cannotPlaceTaskInRow', cannotPlaceTaskInRow);
// 				console.log('-----');
// 				if (r === rows.length - 1) rows.push([]);

// 				if (cannotPlaceTaskInRow) continue;

// 				rows[r].push(checkedTask);
// 			}
// 		}
// 	}

// 	return rows;
// };

export const createTaskRows = (tasks: Task[]) => {
	let rows: Task[][] = [[]];

	for (let t = 0; t < tasks.length; t++) {
		const checkedTask = tasks[t];
		let taskPlaced = false;

		for (let r = 0; r < rows.length; r++) {
			const cannotPlaceTaskInRow = rows[r].some((task) =>
				checkDateRangesOverlap(
					dayjs(task.start_date),
					dayjs(task.end_date),
					dayjs(checkedTask.start_date),
					dayjs(checkedTask.end_date)
				)
			);

			if (!cannotPlaceTaskInRow) {
				rows[r].push(checkedTask);
				taskPlaced = true;
				break; // Break out of the loop once the task is placed in a row
			}
		}

		if (!taskPlaced) {
			// If the task couldn't be placed in any existing row, create a new row
			rows.push([checkedTask]);
		}
	}

	return rows;
};

export const getPositionAndSizeOfTask = (task: Task) => {
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

	return {
		left: xStart,
		width: xEnd - xStart,
		top: yStart,
		height: TASK_HEIGHT,
	};
};
