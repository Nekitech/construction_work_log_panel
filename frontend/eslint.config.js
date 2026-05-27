import antfu from '@antfu/eslint-config'

export default antfu({
	react: true,
	typescript: true,
	stylistic: {
		indent: 'tab',
	},
	formatters: {
		indent: 'tab',
	},
	rules: {
		'no-console': 'off',
		'ts/no-use-before-define': 'off',
	},
}).append({
	files: ['src/shared/ui/**'],
	rules: {
		'react-refresh/only-export-components': 'off',
		'react/no-nested-component-definitions': 'off',
	},
})
