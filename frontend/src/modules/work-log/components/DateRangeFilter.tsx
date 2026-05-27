import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarIcon, X } from 'lucide-react'
import { memo } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

interface DateRangeFilterProps {
	dateFrom: Date | undefined
	dateTo: Date | undefined
	onDateFromChange: (date: Date | undefined) => void
	onDateToChange: (date: Date | undefined) => void
}

export const DateRangeFilter = memo(function DateRangeFilter({ dateFrom, dateTo, onDateFromChange, onDateToChange }: DateRangeFilterProps) {
	const hasFilter = dateFrom || dateTo

	return (
		<div className="flex flex-wrap items-center gap-2">
			<DatePickerButton
				label="С"
				value={dateFrom}
				onChange={onDateFromChange}
				toDate={dateTo}
			/>
			<DatePickerButton
				label="По"
				value={dateTo}
				onChange={onDateToChange}
				fromDate={dateFrom}
			/>
			{hasFilter && (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						onDateFromChange(undefined)
						onDateToChange(undefined)
					}}
				>
					<X className="mr-1 size-4" />
					Сбросить
				</Button>
			)}
		</div>
	)
})

interface DatePickerButtonProps {
	label: string
	value: Date | undefined
	onChange: (date: Date | undefined) => void
	fromDate?: Date
	toDate?: Date
}

function DatePickerButton({ label, value, onChange, fromDate, toDate }: DatePickerButtonProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={cn('gap-2', !value && 'text-muted-foreground')}
				>
					<CalendarIcon className="size-4" />
					{label}
					{value ? format(value, 'dd.MM.yyyy', { locale: ru }) : '—'}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={value}
					onSelect={onChange}
					locale={ru}
					disabled={[
						...(fromDate ? [{ before: fromDate }] : []),
						...(toDate ? [{ after: toDate }] : []),
					]}
				/>
			</PopoverContent>
		</Popover>
	)
}
