import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from './store-features/request-status';
import { inject } from '@angular/core';
import { CartService } from './CartService';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export interface CartStoreState {
  ticketIds: string[];
}

export const CartStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<CartStoreState>({
    ticketIds: [],
  }),
  withComputed(({ ticketIds }) => ({
    count: () => ticketIds().length,
  })),
  withRequestStatus(),
  withMethods((store) => {
    const cartStore = inject(CartService);

    return {
      _load: rxMethod<void>(
        pipe(
          tap(() => {
            return patchState(store, setPending());
          }),
          switchMap(() =>
            cartStore.loadTicketIds().pipe(
              tapResponse({
                next: (ticketIds) => {
                  return patchState(store, { ticketIds: ticketIds }, setFulfilled());
                },
                error: (error: { message: string }) => {
                  return patchState(store, setError(error.message));
                },
              }),
            ),
          ),
        ),
      ),
      buyTicket: rxMethod<{ eventId: string }>(
        exhaustMap(({ eventId }) => {
          patchState(
            store,
            (state) => ({
              ticketIds: [...state.ticketIds, eventId],
            }),
            setPending(),
          );

          return cartStore.buyTicket(eventId).pipe(
            tapResponse({
              next: () => {
                console.log('Ticket bought successfully');
                patchState(store, setFulfilled());
              },
              error: (error: { message: string }) => {
                console.log('Failed to buy ticket:', [error]);

                patchState(
                  store,
                  (state) => {
                    const lastAdded = state.ticketIds.lastIndexOf(eventId);

                    if (lastAdded === -1) {
                      return state;
                    }

                    const newIds = [...state.ticketIds];
                    newIds.splice(lastAdded, 1);
                    return { ticketIds: newIds };
                  },
                  setError(error.message),
                );
              },
            }),
          );
        }),
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store._load();
    },
  }),
);
