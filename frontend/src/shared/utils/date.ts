import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

export function formatDate(date: string | Date): string {
	const d = typeof date === 'string' ? parseISO(date) : date
	return format(d, 'dd.MM.yyyy', { locale: ru })
}

export function toISODateString(date: Date): string {
	return format(date, 'yyyy-MM-dd')
}
