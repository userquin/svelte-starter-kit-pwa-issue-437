/// <references types="houdini-svelte">

const defaultMarshall = {
	unmarshal(val) {
		return val;
	},
	marshal(val) {
		return val;
	}
};

/** @type {import('houdini').ConfigFile} */
const config = {
	apiUrl: 'https://prime-iguana-64.hasura.app/v1/graphql',
	schemaPollHeaders: {
		'x-hasura-admin-secret': 'wPzio98C1tJo6OEOxYJQ4jzZVYmPTGZ2Fx6ibiRAwOx9aPj8TuhnXZD4tq3hMAbM'
	},

	plugins: {
		'houdini-svelte': {
			client: './src/client'
		}
	},

	scalars: {
		DateTime: {
			// the corresponding typescript type
			type: 'Date',
			// turn the api's response into that type
			unmarshal(val) {
				return new Date(val);
			},
			// turn the value into something the API can use
			marshal(date) {
				return date.getTime();
			}
		},

		Decimal: {
			type: 'number',

			unmarshal(val) {
				return new Number(val);
			},

			marshal(number) {
				return number.toString();
			}
		},

		URL: {
			type: 'URL',

			unmarshal(val) {
				return new URL(val);
			},

			marshal(url) {
				return url.toString();
			}
		},

		uuid: {
			type: 'string',
			...defaultMarshall
		},
		_text: {
			type: 'string',
			...defaultMarshall
		},
		hstore: {
			type: 'object',
			...defaultMarshall
		},
		jsonb: {
			type: 'object',
			...defaultMarshall
		},
		timestamp: {
			type: 'string',
			...defaultMarshall
		},
		timestamptz: {
			type: 'string',
			...defaultMarshall
		}
	}
};

export default config;
