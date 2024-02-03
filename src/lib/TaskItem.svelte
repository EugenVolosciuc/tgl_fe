<script lang="ts">
	import { draggable, type DragEventData } from '@neodrag/svelte';

	import { getColorBasedOnColorId } from '@/utils/color';
	import type { Task } from '@/types';
	import { getPositionAndSizeOfTask } from '@/utils/positioning';
	import { taskRows } from '@/utils/stores';
	import dayjs from 'dayjs';
	import { DISPLAY_DATE_FORMAT } from '@/utils/date-utils';

	export let task: Task;
	export let rowIndex: number;

	const paddingValue = 4;
	const gridSize = 64;
	const bgColor = getColorBasedOnColorId(task.color);
	let previousDaysOffset = 0;

	// Initial positioning
	let { left, width, top, height } = getPositionAndSizeOfTask(task);

	const handleDragEnd = (data: DragEventData) => {
		const offsetDays = data.offsetX / gridSize;

		const daysMovedSinceLastDrag = offsetDays - previousDaysOffset;
		previousDaysOffset = offsetDays;

		taskRows.update((prevTaskRows) => {
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

			console.log(
				`Updated dates from ${task.start_date} - ${task.end_date} to ${updatedTask.start_date} - ${updatedTask.end_date} for task "${task.name}"`
			);

			// TODO: Need to stop tasks from overlapping

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
	}}
	role="cell"
	tabindex="0">
	<div class="px-[6px] py-[3px]">
		<p class="text-sm text-white">{task.name}</p>
	</div>
</div>
