import { Component, computed, inject, signal } from '@angular/core';
import { DevFestEvent } from '../../models/event.model';
import { debounce, disabled, form, FormField, required } from '@angular/forms/signals';
import { FormSubmittedEvent } from '@angular/forms';
import { EventsService } from '../../core/events.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

interface CreateEventForm extends Omit<DevFestEvent, 'id'> {}

@Component({
  selector: 'app-create-event',
  imports: [FormField, NgClass],
  template: `
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>

      <!-- TODO Mod 4: Bind [group] -->
      <form class="space-y-6" (submit)="onSubmit($event)">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
          <!-- TODO Mod 4: Bind [control] -->
          <input
            [formField]="form.title"
            type="text"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Angular Workshop"
          />

          @if (form.title().touched() && form.title().invalid()) {
            <div class="text-red-500 text-sm mt-1">
              {{ form.title().errors()[0]?.message }}
            </div>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            [formField]="form.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-md outline-none"
          ></textarea>

          @if (form.description().touched() && form.description().invalid()) {
            <p class="text-red-500 text-sm mt-1">{{ form.description().errors()[0].message }}</p>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            [formField]="form.date"
            type="datetime-local"
            class="w-full px-4 py-2 border rounded-md"
          />

          @if (form.date().touched() && form.date().invalid()) {
            <div class="text-red-500 text-sm mt-1">
              {{ form.date().errors()[0]?.message }}
            </div>
          }
        </div>

        <div class="border-t border-gray-100 pt-4">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">Speakers</label>
            <button
              type="button"
              (click)="addSpeaker()"
              class="text-sm text-blue-600 hover:underline"
            >
              + Add Speaker
            </button>
          </div>

          <div class="space-y-2">
            @for (speaker of eventData().speakers; track $index) {
              <div class="flex gap-2">
                <input
                  [formField]="form.speakers[$index]"
                  type="text"
                  placeholder="Speaker name"
                  class="flex-1 p-4 py-2 rounded-md border"
                />

                <button type="button" (click)="removeSpeaker($index)" class="p-2 text-red-500">
                  X
                </button>
              </div>
            }
          </div>
        </div>

        <div class="flex justify-end gap-4 pt-4">
          <button type="button" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button
            type="submit"
            [disabled]="form().invalid() || isCreatingEvent()"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            [ngClass]="
              form().invalid()
                ? 'cursor-not-allowed opacity-50'
                : isCreatingEvent()
                  ? 'cursor-wait opacity-70 animate-pulse'
                  : 'cursor-pointer'
            "
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CreateEvent {
  readonly eventService = inject(EventsService);
  readonly router = inject(Router);

  readonly eventData = signal<CreateEventForm>({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    image: '/images/ssr-at-scale.png',
    location: '',
    speakers: [],
  });

  readonly form = form(this.eventData, (root) => {
    required(root.title, { message: 'Title is required' });
    required(root.date, { message: 'Date is required' });
    debounce(root.description, 1000);
    disabled(root.description, ({ valueOf }) => !valueOf(root.date));
    required(root.speakers, { message: 'At least one speaker is required' });
  });

  isCreatingEvent = computed(() => this.eventService.isCreating());

  addSpeaker() {
    this.eventData.update((currentData) => ({
      ...currentData,
      speakers: [...currentData.speakers, ''],
    }));
  }

  removeSpeaker(index: number) {
    this.eventData.update((currentData) => ({
      ...currentData,
      speakers: currentData.speakers.filter((_, i) => i !== index),
    }));
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.form().invalid()) {
      return;
    }

    this.eventService.createEvent(this.form().value()).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
