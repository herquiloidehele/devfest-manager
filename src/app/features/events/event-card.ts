import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { DatePipe, NgClass, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-card',
  imports: [NgOptimizedImage, NgClass, DatePipe, RouterLink],
  template: `
    <div
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <img
        [ngSrc]="image()"
        class="object-cover w-full h-full max-h-full max-w-full"
        alt="Event thumbnail"
        width="300"
        height="300"
        priority="priority"
      />

      <div class="p-6">
        <div class="flex justify-between items-center mt-4">
          <!-- TODO Mod 1: Add Date using DatePipe -->
          <p class="text-sm text-blue-600 font-semibold mb-2">
            {{ (date() | date: 'mediumDate') || 'TBA' }}
          </p>

          @let days = daysUntil();

          @if (days != null) {
            <div
              class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
            >
              @if (days > 0) {
                In {{ days }} days
              } @else if (days < 0) {
                Past Event
              } @else {
                Happening Now!
              }
            </div>
          }
        </div>

        <!-- TODO Mod 1: Add Title Input -->
        <h3 class="text-xl font-bold text-gray-800 my-2">{{ title() }}</h3>

        <div class="flex justify-between items-center mt-4">
          <!-- TODO Mod 1: Add Derived State (Like Button) -->
          <button
            class="hover:text-red-500 hover:cursor-pointer transition-colors cursor-pointer"
            [ngClass]="isFavorite() ? 'text-red-500' : 'text-gray-400'"
            (click)="toggleFavorite()"
          >
            {{ isFavorite() ? '♥' : '♡' }} Like
          </button>

          <!-- TODO Mod 1: Add Output -->
          <button
            class="text-gray-400 text-sm hover:text-gray-600 cursor-pointer"
            (click)="handleDelete()"
          >
            Remove
          </button>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-100 text-right">
          <a
            class="text-blue-600 font-medium hover:underline cursor-pointer"
            [routerLink]="['/event', id()]"
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  `,
})
export class EventCard {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly image = input.required<string>();
  readonly date = input<string>();
  readonly initialFavorite = input<boolean>();
  readonly onDelete = output<string>();

  isFavorite = linkedSignal(this.initialFavorite);

  daysUntil = computed(() => {
    const eventDate = this.date();

    if (!eventDate) return null;

    const todayDate = new Date();
    const target = new Date(eventDate);
    const DAYS_IN_MILLIS = 1000 * 60 * 60 * 24;

    const diffTime = target.getTime() - todayDate.getTime();
    return Math.ceil(diffTime / DAYS_IN_MILLIS);
  });

  toggleFavorite() {
    this.isFavorite.update((oldValue) => !oldValue);
  }

  handleDelete() {
    this.onDelete.emit('1');
  }
}
