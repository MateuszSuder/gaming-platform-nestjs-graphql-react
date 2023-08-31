import { HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthorizationModule } from './authorization/authorization.module';
import { GraphQLFormattedError } from 'graphql/error';
import { ThreeCardsMonteModule } from './game/three-cards-monte/three-cards-monte.module';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { SevenFruitsModule } from './game/seven-fruits/seven-fruits.module';
import { PlinkoModule } from './game/plinko/plinko.module';

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
      subscriptions: {
        'graphql-ws': {
          onConnect: (context: any) => {
            const { extra } = context;

            extra.token = extra.request.headers.cookie
              .split('; ')
              .find((el) => el.includes('token='))
              .split('=')[1];
          },
        },
      },
      context: ({ req, extra }, rep) => {
        return { req, rep, extra };
      },
      formatError: (formattedError) => {
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
    UserModule,
    SevenFruitsModule,
    PlinkoModule,
  ],
  providers: [],
})
export class AppModule {}
