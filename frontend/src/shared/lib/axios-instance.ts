import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

const instance = axios.create({
	baseURL: '/api',
})

export async function axiosInstance<T>(config: AxiosRequestConfig): Promise<T> {
	const response = await instance(config)
	return response.data
}
