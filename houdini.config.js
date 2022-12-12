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
	// FIXME: I want to use: apiUrl: 'env:PUBLIC_CONFY_API_ENDPOINT',
	apiUrl: 'https://decent-donkey-83.hasura.app/v1/graphql',
	schemaPollHeaders: {
		// FIXME: I want to use: 'x-hasura-admin-secret': 'env:PUBLIC_CONFY_API_TOKEN'
		'x-hasura-admin-secret': 'wao129Ie5SxRQ7RB2UhTcIMU9J6g71jDnmOMs8EZABC62WMufSd6uKFgwGt4PW5K'
	},

	plugins: {
		'houdini-svelte': {
			client: './src/lib/graphql/client'
		}
	},
	quietQueryErrors: true,
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
