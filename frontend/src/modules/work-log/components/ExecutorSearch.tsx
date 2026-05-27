import { Search, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

interface ExecutorSearchProps {
	value: string
	onChange: (value: string) => void
}

export function ExecutorSearch({ value, onChange }: ExecutorSearchProps) {
	return (
		<div className="relative flex items-center">
			<Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
			<Input
				className="h-8 pl-8 pr-4 text-sm w-52"
				placeholder="Поиск по исполнителю"
				value={value}
				onChange={e => onChange(e.target.value)}
			/>
			{value && (
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-0 size-8 hover:bg-transparent"
					onClick={() => onChange('')}
				>
					<X className="size-4 text-muted-foreground" />
				</Button>
			)}
		</div>
	)
}
