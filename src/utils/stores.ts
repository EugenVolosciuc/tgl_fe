import { writable } from 'svelte/store';

export const cursorPosition = writable({ x: 0, y: 0 });
