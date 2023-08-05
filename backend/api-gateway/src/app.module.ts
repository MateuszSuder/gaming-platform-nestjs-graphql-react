import { HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthorizationModule } from './authorization/authorization.module';
import { GraphQLFormattedError } from 'graphql/error';
import { ThreeCardsMonteModule } from './game/three-cards-monte/three-cards-monte.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    AuthorizationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      autoTransformHttpErrors: true,
      includeStacktraceInErrorResponses: false,
      fieldResolverEnhancers: ['filters'],
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      context: (req, rep) => ({ req, rep }),
      formatError: (formattedError) => {
        console.log(formattedError);
        try {
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
                )?.statusCode,
            },
            locations: formattedError.locations,
          };

          return error;
        } catch (e) {
          console.error(e);
        }
      },
    }),
    ThreeCardsMonteModule,
    GameModule,
  ],
  providers: [],
})
export class AppModule {}
