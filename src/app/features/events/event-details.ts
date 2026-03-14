import { Component, inject, input } from '@angular/core';
import { EventsService } from '../../core/events.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/CartService';
import { TabGroup } from '../../shared/tabs/tab-group';
import { Tab } from '../../shared/tabs/tab';

@Component({
  selector: 'app-event-details',
  imports: [DatePipe, RouterLink, CommonModule, TabGroup, Tab],
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
        <div class="flex gap-4 w-full">
          <div class="w-full gap-8">
            <div class="md:col-span-2 space-y-4">
              <h1 class="text-4xl font-bold text-gray-900">{{ eventDetailsData.title }}</h1>
              <p class="text-gray-500 text-lg">
                {{ eventDetailsData.date | date: 'fullDate' }} • {{ eventDetailsData.location }}
              </p>

              <app-tab-group>
                <app-tab label="Overview">
                  <p class="text-gray-700 leading-relaxed text-lg">
                    {{ eventDetailsData.description }}
                  </p>
                </app-tab>

                <app-tab label="Venue">
                  <p class="mb-4 text-gray-600">Location: {{ eventDetailsData.location }}</p>

                  <!-- Move our Defer block from Mod 1 here! -->
                  @defer (hydrate on viewport) {
                    <div class="h-64 bg-gray-200 rounded relative">
                      <img src="/images/venue-map.png" class="object-cover w-full h-full" />
                    </div>
                  } @placeholder {
                    <div class="h-64 bg-gray-100 flex items-center justify-center">
                      Loading Map...
                    </div>
                  }
                </app-tab>

                <app-tab label="Speakers">
                  @if (eventDetailsData.speakers.length > 0) {
                    <ul class="space-y-3">
                      @for (speaker of eventDetailsData.speakers; track speaker) {
                        <li class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div
                            class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold"
                          >
                            {{ speaker.charAt(0) }}
                          </div>
                          <span class="text-gray-700 font-medium">{{ speaker }}</span>
                        </li>
                      }
                    </ul>
                  } @else {
                    <div class="p-4 bg-yellow-50 text-yellow-800 rounded">
                      Speaker list coming soon.
                    </div>
                  }
                </app-tab>
              </app-tab-group>
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
