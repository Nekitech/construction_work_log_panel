import type { WorkLogControllerFindAllSortOrder } from '@/api/models'
import { keepPreviousData } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { useWorkLogControllerFindAll } from '@/api/work-logs/work-logs'
import { DateRangeFilter } from '@/modules/work-log/components/DateRangeFilter'
import { ExecutorSearch } from '@/modules/work-log/components/ExecutorSearch'
import { WorkLogPagination } from '@/modules/work-log/components/WorkLogPagination'
import { WorkLogTable } from '@/modules/work-log/components/WorkLogTable'
import { useDebounce } from '@/shared/lib/use-debounce'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { toISODateString } from '@/shared/utils/date'

const PAGE_SIZE = 10

export function WorkLogListPage() {
	const navigate = useNavigate()
	const [dateFrom, setDateFrom] = useState<Date | undefined>()
	const [dateTo, setDateTo] = useState<Date | undefined>()
	const [sortOrder, setSortOrder] = useState<WorkLogControllerFindAllSortOrder>('desc')
	const [page, setPage] = useState(1)
	const [executorSearch, setExecutorSearch] = useState('')
	const debouncedExecutorSearch = useDebounce(executorSearch, 300)

	const handleDateFromChange = useCallback((date: Date | undefined) => {
		setDateFrom(date)
		setPage(1)
	}, [])

	const handleDateToChange = useCallback((date: Date | undefined) => {
		setDateTo(date)
		setPage(1)
	}, [])

	const handleSortOrderChange = useCallback((order: WorkLogControllerFindAllSortOrder) => {
		setSortOrder(order)
		setPage(1)
	}, [])

	function handleExecutorSearchChange(value: string) {
		setExecutorSearch(value)
		setPage(1)
	}

	const { data: response, isLoading } = useWorkLogControllerFindAll(
		{
			dateFrom: dateFrom ? toISODateString(dateFrom) : undefined,
			dateTo: dateTo ? toISODateString(dateTo) : undefined,
			executorName: debouncedExecutorSearch || undefined,
			sortOrder,
			page,
			limit: PAGE_SIZE,
		},
		{ query: { placeholderData: keepPreviousData } },
	)

	const entries = response?.data ?? []
	const totalPages = response?.totalPages ?? 1
	const total = response?.total ?? 0

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Журнал работ</h1>
					<p className="text-sm text-muted-foreground">Учёт выполненных работ на объекте</p>
				</div>
				<Button onClick={() => navigate('/work-logs/create')} variant="default">
					<Plus className="mr-2 size-4" />
					Добавить запись
				</Button>
			</div>

			<Separator />

			<div className="flex flex-wrap items-center gap-6">
				<div className="flex items-center gap-4">
					<span className="text-sm font-medium text-muted-foreground">Фильтр по дате:</span>
					<DateRangeFilter
						dateFrom={dateFrom}
						dateTo={dateTo}
						onDateFromChange={handleDateFromChange}
						onDateToChange={handleDateToChange}
					/>
				</div>
				<ExecutorSearch
					value={executorSearch}
					onChange={handleExecutorSearchChange}
				/>
			</div>

			<WorkLogTable
				data={entries}
				isLoading={isLoading}
				sortOrder={sortOrder}
				onSortOrderChange={handleSortOrderChange}
			/>

			{!isLoading && totalPages > 1 && (
				<WorkLogPagination
					page={page}
					totalPages={totalPages}
					total={total}
					onPageChange={setPage}
				/>
			)}
		</div>
	)
}
