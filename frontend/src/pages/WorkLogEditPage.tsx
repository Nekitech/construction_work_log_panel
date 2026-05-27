import type { WorkLogFormValues } from '@/modules/work-log/forms/WorkLogFormSchema'
import { parseISO } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { useWorkLogControllerFindOne } from '@/api/work-logs/work-logs'
import { WorkLogForm } from '@/modules/work-log/forms/WorkLogForm'
import { useWorkLogMutations } from '@/modules/work-log/hooks/useWorkLogMutations'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'

export function WorkLogEditPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const entryId = Number(id)

	const { data: entry, isLoading, isError } = useWorkLogControllerFindOne(
		entryId,
		{ query: { enabled: !Number.isNaN(entryId) } },
	)
	const { updateMutation, formValuesToUpdateDto } = useWorkLogMutations()

	if (Number.isNaN(entryId) || isError) {
		return (
			<div className="space-y-6">
				<Button variant="ghost" size="sm" onClick={() => navigate('/work-logs')} className="-ml-2">
					<ChevronLeft className="mr-1 size-4" />
					Назад к журналу
				</Button>
				<p className="text-sm text-destructive">Запись не найдена.</p>
			</div>
		)
	}

	async function handleSubmit(values: WorkLogFormValues) {
		await updateMutation.mutateAsync({ id: entryId, data: formValuesToUpdateDto(values) })
		navigate('/work-logs')
	}

	const defaultValues = entry
		? {
				date: parseISO(entry.date),
				workTypeId: entry.workTypeId,
				volume: entry.volume,
				executorName: entry.executorName,
			}
		: undefined

	return (
		<div className="space-y-6">
			<div>
				<Button variant="ghost" size="sm" onClick={() => navigate('/work-logs')} className="-ml-2 mb-2">
					<ChevronLeft className="mr-1 size-4" />
					Назад к журналу
				</Button>
				<h1 className="text-2xl font-semibold tracking-tight">Редактирование записи</h1>
				<p className="text-sm text-muted-foreground">Измените данные о выполненной работе</p>
			</div>

			<Separator />

			<div className="max-w-2xl">
				{isLoading
					? (
							<div className="space-y-4">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-32" />
							</div>
						)
					: (
							<WorkLogForm
								mode="edit"
								defaultValues={defaultValues}
								onSubmit={handleSubmit}
								isSubmitting={updateMutation.isPending}
							/>
						)}
			</div>
		</div>
	)
}
