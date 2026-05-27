import { Outlet } from 'react-router'
import { Separator } from '@/shared/ui/separator'

export function AppLayout() {
	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-background">
				<div className="mx-auto max-w-6xl px-4 py-3">
					<div className="flex items-center gap-3">
						<div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
							СБ
						</div>
						<div>
							<p className="text-xs text-muted-foreground leading-none">Строительный объект</p>
							<p className="text-sm font-medium leading-tight">Журнал работ</p>
						</div>
					</div>
				</div>
			</header>

			<Separator />

			<main className="mx-auto max-w-6xl px-4 py-8">
				<Outlet />
			</main>
		</div>
	)
}
