import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { DevFestEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private httpUrl = 'http://localhost:3000/events';
  private readonly httpClient = inject(HttpClient);

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
    })
  }

  public deleteEvent(eventId: string){
    return this.httpClient.delete(`${this.httpUrl}/${eventId}`);
  };
}
