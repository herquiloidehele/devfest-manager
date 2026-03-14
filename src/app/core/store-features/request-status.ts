import { signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string };

export interface RequestStatusState {
  requestStatus: RequestStatus;
}

export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>({
      requestStatus: 'idle',
    }),
    withComputed(({ requestStatus }) => {
      return {
        isPending: () => requestStatus() === 'pending',
        isFulfilled: () => requestStatus() === 'fulfilled',
        isError: () => {
          const status = requestStatus();
          return typeof status === 'object' && !!status.error;
        },
      };
    }),
  );
}

export function setPending(): RequestStatusState {
  return {
    requestStatus: 'pending',
  };
}

export function setFulfilled(): RequestStatusState {
  return {
    requestStatus: 'fulfilled',
  };
}

export function setError(error: string): RequestStatusState {
  return {
    requestStatus: { error: error },
  };
}
