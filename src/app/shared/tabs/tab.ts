import { Component, computed, inject, input } from '@angular/core';
import { TabState } from './tab-state';
import { single } from 'rxjs';

@Component({
  selector: 'app-tab',
  template: `
    @if (isActive()) {
      <div class="p-4">
        <ng-content />
      </div>
    }
  `,
})
export class Tab {
  tabState = inject(TabState);
  readonly label = input.required<string>();

  isActive = computed(() => {
    return this.label() === this.tabState.activeTab();
  });
}
