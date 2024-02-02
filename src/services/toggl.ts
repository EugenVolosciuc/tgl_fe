import dayjs from 'dayjs';

import type { Task } from '@/types';

const API_VERSION = 'v6-rc1';
const LS_WORKSPACE_ID = 'tgl_workspaceId';
const LS_TEAM_ID = 'tgl_teamId';
const LS_AUTH_TOKEN = 'tgl_authToken';

export const getRequestData = () => {
	const workspaceId = localStorage.getItem(LS_WORKSPACE_ID);
	const teamId = localStorage.getItem(LS_TEAM_ID);
	const authToken = localStorage.getItem(LS_AUTH_TOKEN);

	const defaultWorkspaceId = '733122';
	const defaultTeamId = '715853';
	const defaultAuthToken =
		'eyJhbGciOiJFZERTQSIsImtpZCI6IjIwMjMtMDctMjUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsicGxhbiJdLCJleHAiOjE3MDY4NDcwMTMsImlhdCI6MTcwNjg0MzQxMywiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy50b2dnbC5zcGFjZSIsImp0aSI6IjkxZDY5YmRhYzg2NzcyZjQ4MTQyYWQwZTUyNzRlYzA2IiwibmJmIjoxNzA2ODQzMTEzLCJzdWIiOiJMRWRQSm5RdjNVdjVCUjk1UUhZekJ6In0.CisxjW3lj6QKo03WllaYhgaj0K721InnURudCwiR-_JDoQ600L7IL-8amwb0eoES8ARAMC-2-mILn6GaSLL1Bg';

	if (!workspaceId) localStorage.setItem(LS_WORKSPACE_ID, defaultWorkspaceId);
	if (!teamId) localStorage.setItem(LS_TEAM_ID, defaultTeamId);
	if (!authToken) localStorage.setItem(LS_AUTH_TOKEN, defaultAuthToken);

	return {
		workspaceId: workspaceId || defaultWorkspaceId,
		teamId: teamId || defaultTeamId,
		authToken: authToken || defaultAuthToken,
	};
};

export const getTasks = async ({
	since,
	until,
	teamId,
	workspaceId,
}: {
	since: Date;
	until: Date;
	teamId: string;
	workspaceId: string;
}): Promise<Task[]> => {
	const formattedStartDate = dayjs(since).format('YYYY-MM-DD');
	const formattedEndDate = dayjs(until).format('YYYY-MM-DD');

	const { authToken } = getRequestData();

	const response = await fetch(
		`https://api.plan.toggl.space/api/${API_VERSION}/${workspaceId}/tasks?since=${formattedStartDate}&until=${formattedEndDate}&short=true&team=${teamId}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	return await response.json();
};
