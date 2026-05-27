import { z } from 'zod'

export const workLogFormSchema = z.object({
	date: z.date({ message: 'Дата обязательна' }),
	workTypeId: z
		.number({ message: 'Выберите вид работ' })
		.int()
		.positive('Выберите вид работ'),
	volume: z
		.number({ message: 'Укажите объём' })
		.positive('Объём должен быть больше 0'),
	executorName: z
		.string()
		.min(1, 'ФИО обязательно')
		.max(200, 'ФИО слишком длинное'),
})

export type WorkLogFormValues = z.infer<typeof workLogFormSchema>
