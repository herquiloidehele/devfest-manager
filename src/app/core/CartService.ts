import { computed, inject, Injectable, signal } from '@angular/core';
import { TICKETS_URL } from './tokens';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

interface TicketEntry {
  id: string;
  eventId: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly ticketUrl = inject(TICKETS_URL);

  public loadTickets() {
    return this.httpClient.get<TicketEntry[]>(this.ticketUrl);
  }

  public loadTicketIds() {
    return this.loadTickets().pipe(
      map((response: TicketEntry[]) => {
        return response.map((entry) => entry.id);
      }),
    );
  }

  public buyTicket(eventId: string) {
    return this.httpClient.post(this.ticketUrl, { eventId });
  }
}
