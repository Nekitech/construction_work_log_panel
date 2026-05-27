import type { WorkLogControllerFindAllSortOrder, WorkLogResponseDto } from '@/api/models'
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { memo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { formatDate } from '@/shared/utils/date'
import { useWorkLogMutations } from '../hooks/useWorkLogMutations'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

interface WorkLogTableProps {
	data: WorkLogResponseDto[]
	isLoading: boolean
	sortOrder: WorkLogControllerFindAllSortOrder
	onSortOrderChange: (order: WorkLogControllerFindAllSortOrder) => void
}

export const WorkLogTable = memo(function WorkLogTable({ data, isLoading, sortOrder, onSortOrderChange }: WorkLogTableProps) {
	const navigate = useNavigate()
	const { deleteMutation } = useWorkLogMutations()
	const [deleteId, setDeleteId] = useState<number | null>(null)

	function toggleSort() {
		onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<button
									type="button"
									onClick={toggleSort}
									className="flex items-center gap-1 font-medium hover:text-foreground"
								>
									Дата
									{sortOrder === 'asc'
										? <ArrowUp className="size-4" />
										: sortOrder === 'desc'
											? <ArrowDown className="size-4" />
											: <ArrowUpDown className="size-4" />}
								</button>
							</TableHead>
							<TableHead>Вид работ</TableHead>
							<TableHead>Объём</TableHead>
							<TableHead>ФИО исполнителя</TableHead>
							<TableHead className="w-24 text-right">Действия</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading
							? Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i}>
										{Array.from({ length: 5 }).map((_, j) => (
											<TableCell key={j}>
												<Skeleton className="h-4 w-full" />
											</TableCell>
										))}
									</TableRow>
								))
							: data.length === 0
								? (
										<TableRow>
											<TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
												Записей пока нет. Добавьте первую запись.
											</TableCell>
										</TableRow>
									)
								: data.map(entry => (
										<TableRow key={entry.id}>
											<TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
											<TableCell>{entry.workType.name}</TableCell>
											<TableCell>
												{entry.volume}
												{' '}
												{entry.workType.unit}
											</TableCell>
											<TableCell>{entry.executorName}</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-1">
													<Button
														variant="ghost"
														aria-label={`Редактировать запись от ${formatDate(entry.date)}`}
														size="icon"
														onClick={() => navigate(`/work-logs/${entry.id}/edit`)}
														title="Редактировать"
													>
														<Pencil className="size-4" />
													</Button>
													<Button
														variant="ghost"
														aria-label={`Удалить запись от ${formatDate(entry.date)}`}
														size="icon"
														onClick={() => setDeleteId(entry.id)}
														title="Удалить"
														className="text-destructive hover:text-destructive"
													>
														<Trash2 className="size-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
					</TableBody>
				</Table>
			</div>

			<DeleteConfirmDialog
				open={deleteId !== null}
				onOpenChange={open => !open && setDeleteId(null)}
				onConfirm={() => {
					if (deleteId !== null) {
						deleteMutation.mutate({ id: deleteId }, { onSettled: () => setDeleteId(null) })
					}
				}}
				isLoading={deleteMutation.isPending}
			/>
		</>
	)
})
