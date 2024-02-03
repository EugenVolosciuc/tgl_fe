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

	const flipDurationMs = 300;

	let rows: Task[][] = [];
	$: tasks = rows.flat(1);

	$: console.log('TASKS!', tasks);

	const startDate = dayjs().subtract(2, 'week');
	const endDate = dayjs().add(2, 'week');
	const dateRange = getDaysBetween(startDate, endDate);

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
		console.log('event.detail.items', event.detail.items);
		const updatedRows = [...rows];
		updatedRows[rowIndex] = event.detail.items;
		rows = updatedRows;
		// tasks = event.detail.items;
		// Instead of assigning to tasks (which are not even used...) I need to assign to rows
	};

	onMount(async () => {
		const { workspaceId, teamId } = TogglService.getRequestData();
		const tasksPromise = TogglService.getTasks({
			since: startDate.toDate(),
			until: endDate.toDate(),
			teamId,
			workspaceId,
		});
		const tasks = (await tasksPromise).sort((a, b) => a.weight - b.weight);

		rows = createTaskRows(tasks);
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
				<div
					class="absolute w-full"
					style="top: {(i + 1) * TASK_HEIGHT}px; height: {TASK_HEIGHT}px"
					use:dndzone={{ items: rows[i], flipDurationMs }}
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
