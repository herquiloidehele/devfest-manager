import { inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { DevFestEvent } from '../models/event.model';
import { finalize } from 'rxjs';
import { API_URL } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private url = inject(API_URL);
  private httpUrl = `${this.url}/events`;
  private readonly httpClient = inject(HttpClient);
  readonly isCreating = signal(false);
  readonly isDeleting = signal(false);

  public getEventResource(query: Signal<string>) {
    return httpResource<DevFestEvent[]>(() => {
      const q = query();
      if (!q) {
        return this.httpUrl;
      }

      return `${this.httpUrl}?q=${query()}`;
    });
  }

  public getEventById(eventId: Signal<string>) {
    return httpResource<DevFestEvent>(() => {
      const id = eventId();
      if (!id) {
        throw new Error('Event ID is required');
      }

      return `${this.httpUrl}/${id}`;
    });
  }

  public deleteEvent(eventId: string) {
    this.isDeleting.set(true);
    return this.httpClient.delete(`${this.httpUrl}/${eventId}`).pipe(
      finalize(() => {
        this.isDeleting.set(false);
      }),
    );
  }

  public createEvent(event: Omit<DevFestEvent, 'id'>) {
    this.isCreating.set(true);
    return this.httpClient.post<DevFestEvent>(this.httpUrl, event).pipe(
      finalize(() => {
        this.isCreating.set(false);
      }),
    );
  }
}
