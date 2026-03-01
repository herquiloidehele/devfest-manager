import { Component } from '@angular/core';
import { EventCard } from './event-card';

@Component({
  selector: 'app-event-list',
  imports: [EventCard],
  template: `
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
      <!-- TODO Mod 1: Add SearchBar here -->
    </div>

    <!-- TODO Mod 2: Wrap in @if (events.isLoading()) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- TODO Mod 2: Use @for to iterate over resource -->

      <!-- Static Placeholders for initial verify -->
      <app-event-card
        title="Angular keynote"
        image="/images/angular-keynote.png"
        date="2026-04-01T17:09:32+00:00"
        (onDelete)="handleDelete($event)"
      />

      <app-event-card
        title="React keynote"
        image="/images/event4.png"
        date="2026-03-01T17:09:32+00:00"
        (onDelete)="handleDelete($event)"
      />

      <app-event-card
        title="Vue keynote"
        image="/images/event4.png"
        date="2026-02-01T17:09:32+00:00"
        (onDelete)="handleDelete($event)"
      />
    </div>
  `,
})
export class EventList {
  // TODO Mod 2: Inject Service and use resource()

  handleDelete(eventId: string) {
    console.log('Delete Event: ' + eventId);
  }
}
