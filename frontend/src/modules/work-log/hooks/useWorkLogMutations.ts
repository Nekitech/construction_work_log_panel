import type { WorkLogFormValues } from '../forms/WorkLogFormSchema'
import type { CreateWorkLogDto, UpdateWorkLogDto } from '@/api/models'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
	getWorkLogControllerFindAllQueryKey,
	useWorkLogControllerCreate,
	useWorkLogControllerRemove,
	useWorkLogControllerUpdate,
} from '@/api/work-logs/work-logs'
import { toISODateString } from '@/shared/utils/date'

export function useWorkLogMutations() {
	const queryClient = useQueryClient()

	const invalidateList = () =>
		queryClient.invalidateQueries({ queryKey: getWorkLogControllerFindAllQueryKey() })

	const createMutation = useWorkLogControllerCreate({
		mutation: {
			onSuccess: () => {
				invalidateList()
				toast.success('Запись добавлена')
			},
			onError: () => toast.error('Ошибка при добавлении записи'),
		},
	})

	const updateMutation = useWorkLogControllerUpdate({
		mutation: {
			onSuccess: () => {
				invalidateList()
				toast.success('Запись обновлена')
			},
			onError: () => toast.error('Ошибка при обновлении записи'),
		},
	})

	const deleteMutation = useWorkLogControllerRemove({
		mutation: {
			onSuccess: () => {
				invalidateList()
				toast.success('Запись удалена')
			},
			onError: () => toast.error('Ошибка при удалении записи'),
		},
	})

	function formValuesToDto(values: WorkLogFormValues): CreateWorkLogDto {
		return {
			date: toISODateString(values.date),
			workTypeId: values.workTypeId,
			volume: values.volume,
			executorName: values.executorName,
		}
	}

	function formValuesToUpdateDto(values: WorkLogFormValues): UpdateWorkLogDto {
		return formValuesToDto(values)
	}

	return { createMutation, updateMutation, deleteMutation, formValuesToDto, formValuesToUpdateDto }
}
