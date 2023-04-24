import { HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthorizationModule } from './authorization/authorization.module';
import { GraphQLFormattedError } from 'graphql/error';

@Module({
  imports: [
    AuthorizationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      autoTransformHttpErrors: true,
      includeStacktraceInErrorResponses: false,
      fieldResolverEnhancers: ['filters'],
      formatError: (formattedError) => {
        console.log(formattedError);
        const error: GraphQLFormattedError = {
          message:
            (formattedError.extensions?.originalError as { errors: string })
              ?.errors || formattedError.message,
          extensions: {
            code:
              HttpStatus[formattedError.extensions?.status as number] ||
              formattedError.extensions?.code,
            statusCode:
              formattedError.extensions?.status ||
              (
                formattedError.extensions.originalError as {
                  statusCode: number;
                }
              ).statusCode,
          },
          locations: formattedError.locations,
        };

        return error;
      },
    }),
  ],
})
export class AppModule {}
