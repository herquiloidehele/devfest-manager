import { Component, inject, input } from '@angular/core';
import { EventsService } from '../../core/events.service';
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/CartService';

@Component({
  selector: 'app-event-details',
  imports: [DatePipe, RouterLink, NgOptimizedImage, CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto min-h-[600px]">
      <a routerLink="/" class="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Events
      </a>

      @if (eventDetails.isLoading()) {
        <div class="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
      }

      @if (eventDetails.error()) {
        <div class="text-red-600 p-4 bg-red-50 rounded">Event not found.</div>
      }

      @let eventDetailsData = eventDetails.value();

      @if (eventDetailsData) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2 space-y-4">
            <h1 class="text-4xl font-bold text-gray-900">{{ eventDetailsData.title }}</h1>
            <p class="text-gray-500 text-lg">
              {{ eventDetailsData.date | date: 'fullDate' }} • {{ eventDetailsData.location }}
            </p>
            <p class="text-gray-700 leading-relaxed text-lg">{{ eventDetailsData.description }}</p>

            <div class="h-96 p-12">
              <p>Check the venue details below</p>
            </div>

            <div class="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100">
              <!--
              @defer (hydrate on viewport)
              SSR Behavior: The SERVER renders the @placeholder content (or the main content if compatible).
              Hydration Behavior: The browser downloads the JS for this block ONLY when it enters the viewport.
              -->
              @defer (hydrate on viewport) {
                <div class="h-140 bg-gray-200 rounded mb-4 overflow-hidden relative">
                  <img
                    ngSrc="/images/venue-map.png"
                    class="w-full h-full object-cover"
                    width="500"
                    height="500"
                    alt="Map image"
                  />
                </div>
              } @placeholder {
                <!-- Rendered instantly on Server, visible immediately -->
                <div
                  class="h-140 bg-gray-100 rounded mb-4 flex items-center justify-center border-2 border-dashed border-gray-300"
                >
                  <span class="text-gray-400">Map Loading...</span>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100">
          <div class="h-48 bg-gray-200 rounded mb-4 overflow-hidden">
            <!-- We will optimize this image in Day 2 -->
            <img [src]="eventDetailsData.image" class="w-full h-full object-cover" />
          </div>

          <button
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg transition"
            (click)="buyTicket()"
          >
            Buy Tickets
          </button>
        </div>
      } @else if (!eventDetails.isLoading() && !eventDetails.error()) {
        <div class="text-gray-500">Event not found.</div>
      }
    </div>
  `,
})
export class EventDetails {
  private readonly eventService = inject(EventsService);
  private readonly cartService = inject(CartService);
  readonly id = input.required<string>();

  readonly eventDetails = this.eventService.getEventById(this.id);

  public buyTicket() {
    this.cartService.buyTicket(this.id());
  }
}
