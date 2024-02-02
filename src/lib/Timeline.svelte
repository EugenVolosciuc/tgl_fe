<script lang="ts">
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	import * as TogglService from '@/services/toggl';
	import type { Task } from '@/types';

	let tasks: Task | null = null;
	let error: any = null;

	onMount(async () => {
		const { workspaceId, teamId } = TogglService.getRequestData();
		const { data, error: tasksError } = await TogglService.getTasks({
			since: dayjs().subtract(1, 'week').toDate(),
			until: dayjs().add(1, 'week').toDate(),
			teamId,
			workspaceId,
		});

		tasks = data;
		error = tasksError;
	});
</script>

<style lang="postcss">
	.logo {
		color: #8b55dd;
		display: block;
		flex: none;
		background: currentColor;
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		width: 1.8333ex;
		height: 1.8333ex;
		mask-image: url('../assets/logo-symbol.svg');
	}
</style>

<main class="flex min-h-screen items-center justify-center">
	<a
		class="logo"
		href="https://plan.toggl.com"
		target="_blank"
		rel="noopener noreferrer">
	</a>
	<p class="ml-1">👋 Welcome to your homework template!</p>
</main>
