module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"overrides": [
		{
			"env": {
				"node": true
			},
			"files": [".eslintrc.{js,cjs}"],
			"parserOptions": {
				"sourceType": "script"
			}
		}
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"react/prop-types": "off",
		"react/jsx-uses-react": "off",
		"react/react-in-jsx-scope": "off",
		"indent": ["error", "tab"],
		"quotes": ["error", "double"],
		"semi": ["error", "always"],
		"eol-last": ["error", "always"],
		"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
		"no-trailing-spaces": "error",
		"no-whitespace-before-property": "error",
		"operator-linebreak": ["error", "before"],
		"comma-dangle": ["error", "never"],
		"array-bracket-newline": ["error", "consistent"],
		"object-property-newline": "error",
		"object-curly-spacing": ["error", "always"]
	}
};
