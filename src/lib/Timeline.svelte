<script lang="ts">
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	import * as TogglService from '@/services/toggl';
	import { getDaysBetween } from '@/utils/date-utils';
	import DayColumn from '@/lib/DayColumn.svelte';
	import TaskItem from '@/lib/TaskItem.svelte';
	import { TASK_HEIGHT, createTaskRows } from '@/utils/positioning';
	import DayHeader from './DayHeader.svelte';
	import { taskRows } from '@/utils/stores';

	const startDate = dayjs().subtract(2, 'week');
	const endDate = dayjs().add(2, 'week');
	const dateRange = getDaysBetween(startDate, endDate);

	onMount(async () => {
		const { workspaceId, teamId } = TogglService.getRequestData();
		const tasksPromise = TogglService.getTasks({
			since: startDate.toDate(),
			until: endDate.toDate(),
			teamId,
			workspaceId,
		});
		const tasks = (await tasksPromise).sort((a, b) => a.weight - b.weight);

		taskRows.set(createTaskRows(tasks));
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

	{#if $taskRows.length > 0}
		<div class="absolute w-full flex-1">
			{#each $taskRows as row, i}
				<div
					class="absolute w-full"
					style="top: {(i + 1) * TASK_HEIGHT}px; height: {TASK_HEIGHT}px">
					{#each row as task (task.id)}
						<TaskItem {task} rowIndex={i} />
					{/each}
				</div>
			{/each}
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
</main>
