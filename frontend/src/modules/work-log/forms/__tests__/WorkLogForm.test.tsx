import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WorkLogForm } from '../WorkLogForm'

vi.mock('@/modules/work-types/hooks/useWorkTypeOptions', () => ({
	useWorkTypeOptions: () => ({
		options: [
			{ value: 1, label: 'Бетонирование (м³)', unit: 'м³' },
			{ value: 2, label: 'Армирование (т)', unit: 'т' },
		],
		isLoading: false,
	}),
}))

function renderForm(props: Partial<React.ComponentProps<typeof WorkLogForm>> = {}) {
	return render(
		<WorkLogForm
			onSubmit={vi.fn().mockResolvedValue(undefined)}
			{...props}
		/>,
	)
}

describe('WorkLogForm', () => {
	describe('Рендер', () => {
		it('отображает все поля формы', () => {
			renderForm()

			expect(screen.getByText('Дата выполнения')).toBeInTheDocument()
			expect(screen.getByText('Вид работ')).toBeInTheDocument()
			expect(screen.getByText('Объём')).toBeInTheDocument()
			expect(screen.getByText('ФИО исполнителя')).toBeInTheDocument()
		})

		it('отображает кнопку "Добавить запись" для новой формы', () => {
			renderForm()

			expect(screen.getByRole('button', { name: /добавить запись/i })).toBeInTheDocument()
		})

		it('отображает кнопку "Сохранить изменения" в режиме редактирования', () => {
			renderForm({ mode: 'edit' })

			expect(screen.getByRole('button', { name: /сохранить изменения/i })).toBeInTheDocument()
		})
	})

	describe('Валидация', () => {
		it('показывает ошибки при отправке пустой формы', async () => {
			const user = userEvent.setup()
			renderForm()

			await user.click(screen.getByRole('button', { name: /добавить запись/i }))

			await waitFor(() => {
				expect(screen.getByText('Дата обязательна')).toBeInTheDocument()
				expect(screen.getByText('ФИО обязательно')).toBeInTheDocument()
			})
		})

		it('показывает ошибку ФИО при превышении 200 символов', async () => {
			const user = userEvent.setup()
			renderForm()

			await user.type(screen.getByPlaceholderText('Иванов Иван Иванович'), 'А'.repeat(201))
			await user.click(screen.getByRole('button', { name: /добавить запись/i }))

			await waitFor(() => {
				expect(screen.getByText('ФИО слишком длинное')).toBeInTheDocument()
			})
		})
	})

	describe('submit', () => {
		it('не вызывает onSubmit если дата не выбрана', async () => {
			const user = userEvent.setup()
			const onSubmit = vi.fn().mockResolvedValue(undefined)
			renderForm({ onSubmit })

			await user.type(screen.getByPlaceholderText('Иванов Иван Иванович'), 'Петров С.Н.')
			await user.type(screen.getByPlaceholderText('0.00'), '15')
			await user.click(screen.getByRole('button', { name: /добавить запись/i }))

			await waitFor(() => {
				expect(screen.getByText('Дата обязательна')).toBeInTheDocument()
			})
			expect(onSubmit).not.toHaveBeenCalled()
		})
	})

	describe('состояние загрузки', () => {
		it('блокирует кнопку при isSubmitting=true', () => {
			renderForm({ isSubmitting: true })

			expect(screen.getByRole('button', { name: /добавить запись/i })).toBeDisabled()
		})

		it('показывает спиннер при isSubmitting=true', () => {
			renderForm({ isSubmitting: true })

			const button = screen.getByRole('button', { name: /добавить запись/i })
			expect(button.querySelector('.animate-spin')).toBeInTheDocument()
		})

		it('кнопка активна при isSubmitting=false', () => {
			renderForm({ isSubmitting: false })

			expect(screen.getByRole('button', { name: /добавить запись/i })).not.toBeDisabled()
		})
	})
})
