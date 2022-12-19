/// <references types="houdini-svelte">

import { loadEnv } from 'vite';
// FIXME: workaround: https://github.com/HoudiniGraphql/houdini/issues/759
Object.assign(process.env, loadEnv(process.env.NODE_ENV, process.cwd(), ['PUBLIC', 'VITE']));

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
	apiUrl: 'env:PUBLIC_CONFY_API_ENDPOINT',
	schemaPollHeaders: {
		'x-hasura-admin-secret': 'env:PUBLIC_CONFY_API_TOKEN'
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
