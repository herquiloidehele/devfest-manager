import { computed, inject, Injectable, signal } from '@angular/core';
import { TICKETS_URL } from './tokens';
import { HttpClient } from '@angular/common/http';

interface TicketEntry {
  id: string;
  eventId: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly ticketUrl = inject(TICKETS_URL);

  private readonly ticketIds = signal<string[]>([]);

  readonly count = computed(() => this.ticketIds().length);

  constructor() {
    this.loadTickets();
  }

  private loadTickets() {
    this.httpClient.get<TicketEntry[]>(this.ticketUrl).subscribe({
      next: (data) => {
        const ids = data.map((entry) => entry.id);
        this.ticketIds.set(ids);
      },
      error: (err) => {},
    });
  }

  public buyTicket(eventId: string) {
    const previousIds = this.ticketIds();

    this.ticketIds.update((ids) => [...ids, eventId]);

    this.httpClient.post(this.ticketUrl, { eventId }).subscribe({
      next: () => {
        console.log('Optimistic update successful');
      },
      error: (err) => {
        console.error('Failed to buy ticket:', err);

        //restore the state
        this.ticketIds.set(previousIds);
      },
    });
  }
}
