import type { WorkLogFormValues } from '@/modules/work-log/forms/WorkLogFormSchema'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { WorkLogForm } from '@/modules/work-log/forms/WorkLogForm'
import { useWorkLogMutations } from '@/modules/work-log/hooks/useWorkLogMutations'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

export function WorkLogCreatePage() {
	const navigate = useNavigate()
	const { createMutation, formValuesToDto } = useWorkLogMutations()

	async function handleSubmit(values: WorkLogFormValues) {
		await createMutation.mutateAsync({ data: formValuesToDto(values) })
		navigate('/work-logs')
	}

	return (
		<div className="space-y-6">
			<div>
				<Button variant="ghost" size="sm" onClick={() => navigate('/work-logs')} className="-ml-2 mb-2">
					<ChevronLeft className="mr-1 size-4" />
					Назад к журналу
				</Button>
				<h1 className="text-2xl font-semibold tracking-tight">Новая запись</h1>
				<p className="text-sm text-muted-foreground">Заполните данные о выполненной работе</p>
			</div>

			<Separator />

			<div className="max-w-2xl">
				<WorkLogForm
					onSubmit={handleSubmit}
					isSubmitting={createMutation.isPending}
				/>
			</div>
		</div>
	)
}
