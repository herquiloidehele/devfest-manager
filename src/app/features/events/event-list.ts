import { Component, inject, signal } from '@angular/core';
import { EventCard } from './event-card';
import { SearchBar } from './search-bar';
import { EventsService } from '../../core/events.service';

@Component({
  selector: 'app-event-list',
  imports: [EventCard, SearchBar],
  template: `
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
      <app-search-bar [(query)]="searchQuery" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      @if (events.isLoading()) {
        <div class="animate-pulse text text-gray-500">Loading...</div>
      }@else{
        @if (events.hasValue()) {
          @for (event of events.value(); track event) {
            <app-event-card
              [id]="event.id"
              [title]="event.title"
              [image]="event.image"
              [date]="event.date"
              (onDelete)="handleDelete(event.id)"
            />
            } @empty {
                <div class="text-gray-500">No events found.</div>
              }
          }
      }
    </div>
  `,
})
export class EventList {
  eventsService = inject(EventsService);
  searchQuery = signal('');

  readonly events = this.eventsService.getEventResource(this.searchQuery);

  handleDelete(eventId: string) {
    this.eventsService.deleteEvent(eventId).subscribe({next: () => {
      this.events.reload();
    },
    error: (error) => {
      console.log(error);
    }
    })
  }
}
