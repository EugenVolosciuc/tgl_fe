import type { Task } from '@/types';
import { writable } from 'svelte/store';

export const taskDragStore = writable<{
	draggedTask: Task | null;
	hoveringOverDate: string | null;
}>({ draggedTask: null, hoveringOverDate: null });
