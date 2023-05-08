import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../events/impl/user-registered.event';
import { map, Observable } from 'rxjs';

@Injectable()
export class RegisterSaga {
  @Saga()
  register = (events$: Observable<any>) => {
    console.log('saga events', events$);
    return events$.pipe(
      ofType(UserRegisteredEvent),
      map((event) => console.log('saga', event.userId)),
    );
  };
}
