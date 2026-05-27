import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { router } from '@/router'
import { queryClient } from '@/shared/lib/query-client'

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster richColors position="top-right" />
		</QueryClientProvider>
	)
}
