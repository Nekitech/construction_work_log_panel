import { createBrowserRouter, Navigate } from 'react-router'
import { WorkLogCreatePage } from '@/pages/WorkLogCreatePage'
import { WorkLogEditPage } from '@/pages/WorkLogEditPage'
import { WorkLogListPage } from '@/pages/WorkLogListPage'
import { AppLayout } from './AppLayout'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <Navigate to="/work-logs" replace /> },
			{ path: 'work-logs', element: <WorkLogListPage /> },
			{ path: 'work-logs/create', element: <WorkLogCreatePage /> },
			{ path: 'work-logs/:id/edit', element: <WorkLogEditPage /> },
		],
	},
])
