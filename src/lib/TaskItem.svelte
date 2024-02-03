<script lang="ts">
	import { draggable, type DragEventData } from '@neodrag/svelte';

	import { getColorBasedOnColorId } from '@/utils/color';
	import type { Task } from '@/types';
	import { getPositionAndSizeOfTask } from '@/utils/positioning';
	import { taskRows } from '@/utils/stores';
	import dayjs from 'dayjs';
	import {
		DISPLAY_DATE_FORMAT,
		checkDateRangesOverlap,
	} from '@/utils/date-utils';

	export let task: Task;
	export let rowIndex: number;

	const paddingValue = 4;
	const gridSize = 64;
	const bgColor = getColorBasedOnColorId(task.color);
	let previousDaysOffset = 0;
	let dragPosition = { x: 0, y: 0 };
	let previousDragPosition = { x: 0, y: 0 };

	// Initial positioning
	let { left, width, top, height } = getPositionAndSizeOfTask(task);

	const handleDragEnd = ({ offsetX, offsetY }: DragEventData) => {
		const offsetDays = offsetX / gridSize;

		const daysMovedSinceLastDrag = offsetDays - previousDaysOffset;

		taskRows.update((prevTaskRows) => {
			const updatedStartDate = dayjs(task.start_date)
				.add(daysMovedSinceLastDrag, 'days')
				.format(DISPLAY_DATE_FORMAT);

			const updatedTask: Task = {
				...task,
				start_date: dayjs(task.start_date)
					.add(daysMovedSinceLastDrag, 'days')
					.format(DISPLAY_DATE_FORMAT),
				end_date: dayjs(task.end_date)
					.add(daysMovedSinceLastDrag, 'days')
					.format(DISPLAY_DATE_FORMAT),
			};
			const updatedRow = prevTaskRows[rowIndex].map((prevTask) => {
				if (prevTask.id === task.id) return updatedTask;

				return prevTask;
			});

			// Need to keep tasks from overlapping
			const taskDateRangesOverlapWithAnotherTask = prevTaskRows[rowIndex].some(
				(prevTask) => {
					// Task cannot overlap with itself
					if (prevTask.id === updatedTask.id) return false;

					return checkDateRangesOverlap(
						dayjs(updatedTask.start_date),
						dayjs(updatedTask.end_date),
						dayjs(prevTask.start_date),
						dayjs(prevTask.end_date)
					);
				}
			);

			if (taskDateRangesOverlapWithAnotherTask) {
				dragPosition = previousDragPosition;
				console.error('Could not move task, it overlaps with another task.');
				return prevTaskRows;
			}

			console.log(
				`Updated dates from ${task.start_date} - ${task.end_date} to ${updatedTask.start_date} - ${updatedTask.end_date} for task "${task.name}"`
			);
			previousDragPosition = { x: offsetX, y: offsetY };
			previousDaysOffset = offsetDays;

			return Object.assign([], prevTaskRows, { [rowIndex]: updatedRow });
		});
	};
</script>

<div
	data-taskId={task.id}
	style="background-color:{bgColor}; height: {height -
		paddingValue * 2}px; left: {left + paddingValue}px; width: {width -
		paddingValue * 2}px; top: {top + paddingValue}px;"
	class="absolute z-10 cursor-move rounded"
	use:draggable={{
		axis: 'x',
		grid: [gridSize, gridSize],
		onDragEnd: handleDragEnd,
		position: dragPosition,
		onDrag: ({ offsetX, offsetY }) => {
			dragPosition = { x: offsetX, y: offsetY };
		},
	}}
	role="cell"
	tabindex="0">
	<div class="px-[6px] py-[3px]">
		<p class="text-sm text-white">{task.name}</p>
	</div>
</div>
