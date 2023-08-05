import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: "http://localhost:8080/graphql",
	documents: "lib/gql/**/*.graphql",
	generates: {
		"types/gql/graphql.tsx": {
			plugins: [
				'typescript', 'typescript-operations', 'typescript-react-apollo'
			],
			config: {
				futureProofEnums: true
			}
		}
	}
};

export default config;
