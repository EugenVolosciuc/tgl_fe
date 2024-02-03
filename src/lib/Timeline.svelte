<script lang="ts">
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import { dndzone } from 'svelte-dnd-action';

	import * as TogglService from '@/services/toggl';
	import { getDaysBetween } from '@/utils/date-utils';
	import DayColumn from '@/lib/DayColumn.svelte';
	import TaskItem from '@/lib/TaskItem.svelte';
	import type { Task } from '@/types';
	import { TASK_HEIGHT, createTaskRows } from '@/utils/positioning';
	import DayHeader from './DayHeader.svelte';
	import { cursorPosition } from '@/utils/stores';

	let rows: Task[][] = [];

	let x = 0;
	let y = 0;
	let lastClickXCoordinate = 0;

	const startDate = dayjs().subtract(2, 'week');
	const endDate = dayjs().add(2, 'week');
	const dateRange = getDaysBetween(startDate, endDate);

	const updateCursorPosition = (event: MouseEvent) => {
		x = event.clientX;
		y = event.clientY;
		cursorPosition.set({ x, y });
	};

	const updateLastClick = (event: MouseEvent) => {
		console.log('MOUSE DOWN EVENT!', event);
		lastClickXCoordinate = event.clientX;
	};

	const handleDndConsider = (
		event: CustomEvent<DndEvent<Task>> & {
			target: any;
		},
		rowIndex: number
	) => {
		const updatedRows = [...rows];
		updatedRows[rowIndex] = event.detail.items;
		rows = updatedRows;
	};

	const handleDndFinalize = (
		event: CustomEvent<DndEvent<Task>> & {
			target: any;
		},
		rowIndex: number
	) => {
		const draggedTaskId = event.detail.info.id;
		const draggedElement = document.querySelector(
			`[data-taskid="${draggedTaskId}"]`
		)!;
		console.log('event', event);

		const updatedRows = [...rows];
		updatedRows[rowIndex] = event.detail.items;
		rows = updatedRows;

		// Get dragged DOM element based on the mouse position
		console.log('draggedElement', draggedElement.getBoundingClientRect());
		console.log('mouseCoordinates', x, y);
		console.log('lastClickXCoordinate', lastClickXCoordinate);

		// What do I know when dropping the element:
		// 1. The element that is dropped (with the initial position, not updated, that's the main issue)
		// 2. The cursor position
		// 3. I can find out what date the user clicks on when the drag started (can I?) (an extreme way would be to save the coordinate of every click, use the last click as the coordinate and get the date column based on that)
		// 4. Based on the cursor position during the drop I can find out the date on which the user dropped the task

		// Idea: I could do a difference between the above two dates,
		// find out by how many days the task was moved
		// Get the width of a day column (always 64px)
		// const offsetX = Multiply the column width by the number of days above
		// change the position of the dropped task by using this formula - (initialXPosition - offsetX)
	};

	// @ts-ignore
	onMount(async () => {
		window.addEventListener('mousemove', updateCursorPosition);
		window.addEventListener('mousedown', updateLastClick);

		const { workspaceId, teamId } = TogglService.getRequestData();
		const tasksPromise = TogglService.getTasks({
			since: startDate.toDate(),
			until: endDate.toDate(),
			teamId,
			workspaceId,
		});
		const tasks = (await tasksPromise).sort((a, b) => a.weight - b.weight);

		rows = createTaskRows(tasks);

		return () => {
			window.removeEventListener('mousemove', updateCursorPosition);
			window.removeEventListener('mousedown', updateLastClick);
		};
	});
</script>

<main id="timeline" class="relative flex min-h-screen flex-col overflow-x-auto">
	<div class="flex">
		{#each dateRange as date}
			<DayHeader {date} />
		{/each}
	</div>
	<div class="flex flex-1 justify-stretch">
		{#each dateRange as date, i}
			<DayColumn {date} isFirstDay={i === 0} />
		{/each}
	</div>

	{#if rows.length > 0}
		<div class="absolute w-full flex-1">
			{#each rows as row, i}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="absolute w-full"
					style="top: {(i + 1) * TASK_HEIGHT}px; height: {TASK_HEIGHT}px"
					use:dndzone={{ items: rows[i] }}
					on:consider={(event) => handleDndConsider(event, i)}
					on:finalize={(event) => handleDndFinalize(event, i)}>
					{#each row as task (task.id)}
						<TaskItem {task} />
					{/each}
				</div>
			{/each}
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
</main>
