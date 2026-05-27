import { useWorkTypesControllerFindAll } from '@/api/work-types/work-types'

export function useWorkTypeOptions() {
	const { data = [], isLoading } = useWorkTypesControllerFindAll()
	const options = data.map(wt => ({ value: wt.id, label: `${wt.name} (${wt.unit})`, unit: wt.unit }))
	return { options, isLoading }
}
