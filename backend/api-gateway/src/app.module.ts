import { Module } from '@nestjs/common';
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
      formatError: (formattedError) => {
        const error: GraphQLFormattedError = {
          message:
            (formattedError.extensions?.originalError as { errors: string })
              ?.errors || formattedError.message,
        };

        return error;
      },
    }),
  ],
})
export class AppModule {}
