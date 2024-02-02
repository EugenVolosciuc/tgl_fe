<script lang="ts">
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	import * as TogglService from '@/services/toggl';
	import type { Task } from '@/types';
	import { getDaysBetween, checkIsWeekend } from '@/utils/date-utils';

	let tasks: Task | null = null;
	let error: any = null;

	const startDate = dayjs().subtract(1, 'week');
	const endDate = dayjs().add(1, 'week');
	const dateRange = getDaysBetween(startDate, endDate);

	onMount(async () => {
		const { workspaceId, teamId } = TogglService.getRequestData();
		const { data, error: tasksError } = await TogglService.getTasks({
			since: startDate.toDate(),
			until: endDate.toDate(),
			teamId,
			workspaceId,
		});

		tasks = data;
		error = tasksError;
	});
</script>

<main class="flex min-h-screen items-stretch justify-center">
	<!-- TODO: save the tasks in a context provider -->
	<!-- Step 1: Make the calendar -->
	{#each dateRange as date, i}
		{@const isToday = date.isToday()}
		{@const isWeekend = checkIsWeekend(date)}

		<div class="flex flex-col text-purple-950" class:bg-slate-100={isWeekend}>
			<!-- Header -->
			<div class="border-b-[1px] border-b-slate-200 bg-white p-1">
				<p
					class="rounded px-4 py-1 text-sm"
					class:bg-orange-500={isToday}
					class:text-white={isToday}
					class:text-slate-400={isWeekend}>
					{date.format('dd')[0]}
					{date.format('M')}
				</p>
			</div>
			<!-- Timeline -->
			<div
				class="flex-1 border-r-[1px] border-b-slate-200"
				class:border-l-[1px]={i === 0}>
			</div>
		</div>
	{/each}
</main>
