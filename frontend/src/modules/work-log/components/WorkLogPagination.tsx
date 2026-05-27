import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { memo } from 'react'
import { Button } from '@/shared/ui/button'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from '@/shared/ui/pagination'

interface WorkLogPaginationProps {
	page: number
	totalPages: number
	total: number
	onPageChange: (page: number) => void
}

export const WorkLogPagination = memo(function WorkLogPagination({ page, totalPages, total, onPageChange }: WorkLogPaginationProps) {
	const isFirst = page === 1
	const isLast = page === totalPages

	return (
		<div className="flex flex-wrap items-center justify-between gap-2">
			<p className="text-sm text-muted-foreground">
				Страница
				{' '}
				{page}
				{' '}
				из
				{' '}
				{totalPages}
				{' · '}
				{total}
				{' '}
				{plural(total)}
			</p>

			<Pagination className="mx-0 w-auto justify-end">
				<PaginationContent>
					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => onPageChange(1)}
							disabled={isFirst}
							title="В начало"
						>
							<ChevronsLeft className="size-4" />
						</Button>
					</PaginationItem>

					<PaginationItem>
						<PaginationPrevious
							onClick={() => onPageChange(page - 1)}
							className={isFirst ? 'pointer-events-none opacity-50' : ''}
						>
							Назад
						</PaginationPrevious>
					</PaginationItem>

					<PaginationItem>
						<PaginationNext
							onClick={() => onPageChange(page + 1)}
							className={isLast ? 'pointer-events-none opacity-50' : ''}
						>
							Вперёд
						</PaginationNext>
					</PaginationItem>

					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => onPageChange(totalPages)}
							disabled={isLast}
							title="В конец"
						>
							<ChevronsRight className="size-4" />
						</Button>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
})

function plural(n: number) {
	const mod10 = n % 10
	const mod100 = n % 100
	if (mod10 === 1 && mod100 !== 11)
		return 'запись'
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
		return 'записи'
	return 'записей'
}
