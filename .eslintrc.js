module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "react-native/react-native": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
    		"react-native"
    ],
    "rules": {
			"react-native/no-unused-styles": 2,
	    "react-native/split-platform-components": 2,
	    "react-native/no-inline-styles": 2,
	    "react-native/no-color-literals": 2,
	    "react-native/no-raw-text": 2,
	    "react-native/no-single-element-style-arrays": 2,
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "no-unused-vars": "warn",
      "react-native/no-color-literals": "warn",
      "react/prop-types": "warn",
    }
};
