<script lang="ts">
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	import * as TogglService from '@/services/toggl';
	import { getDaysBetween } from '@/utils/date-utils';
	import DayColumn from '@/lib/DayColumn.svelte';
	import TaskItem from '@/lib/TaskItem.svelte';
	import type { Task } from '@/types';

	let tasks: Task[] = [];

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
		tasks = await tasksPromise;
	});
</script>

<main
	id="timeline"
	class="relative flex min-h-screen items-stretch overflow-x-auto">
	<!-- TODO?: save the tasks in a context provider -->
	<!-- Step 1: Make the calendar -->
	{#each dateRange as date, i}
		<DayColumn {date} isFirstDay={i === 0} />
	{/each}
	{#if tasks.length > 0}
		{#each tasks as task}
			<TaskItem {task} />
		{/each}
	{:else}
		<p>Loading...</p>
	{/if}
</main>
