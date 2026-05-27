import { defineConfig } from 'orval'

export default defineConfig({
	'work-log': {
		input: '../schema/openapi.json',
		output: {
			mode: 'tags-split',
			target: './src/api',
			schemas: './src/api/models',
			client: 'react-query',
			httpClient: 'axios',
			override: {
				mutator: {
					path: './src/shared/lib/axios-instance.ts',
					name: 'axiosInstance',
				},
			},
		},
	},
})
