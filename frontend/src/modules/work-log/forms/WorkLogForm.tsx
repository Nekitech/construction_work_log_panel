import type { WorkLogFormValues } from './WorkLogFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useWorkTypeOptions } from '@/modules/work-types/hooks/useWorkTypeOptions'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { workLogFormSchema } from './WorkLogFormSchema'

interface WorkLogFormProps {
	defaultValues?: Partial<WorkLogFormValues>
	onSubmit: (values: WorkLogFormValues) => Promise<void>
	isSubmitting?: boolean
}

export function WorkLogForm({ defaultValues, onSubmit, isSubmitting }: WorkLogFormProps) {
	const { options: workTypeOptions, isLoading: workTypesLoading } = useWorkTypeOptions()

	const form = useForm<WorkLogFormValues>({
		resolver: zodResolver(workLogFormSchema),
		defaultValues: {
			executorName: '',
			volume: undefined,
			...defaultValues,
		},
	})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Дата выполнения</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													'pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground',
												)}
											>
												{field.value
													? format(field.value, 'dd.MM.yyyy', { locale: ru })
													: 'Выберите дату'}
												<CalendarIcon className="ml-auto size-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											locale={ru}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="workTypeId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Вид работ</FormLabel>
								<Select
									disabled={workTypesLoading}
									onValueChange={v => field.onChange(Number(v))}
									value={field.value?.toString() ?? ''}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Выберите вид работ" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{workTypeOptions.map(opt => (
											<SelectItem key={opt.value} value={opt.value.toString()}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="volume"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Объём</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										min="0"
										placeholder="0.00"
										{...field}
										value={field.value ?? ''}
										onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="executorName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>ФИО исполнителя</FormLabel>
								<FormControl>
									<Input placeholder="Иванов Иван Иванович" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
					{defaultValues ? 'Сохранить изменения' : 'Добавить запись'}
				</Button>
			</form>
		</Form>
	)
}
