import { Component, contentChildren, effect, inject } from '@angular/core';
import { TabState } from './tab-state';
import { Tab } from './tab';

@Component({
  selector: 'app-tab-group',
  providers: [TabState],
  template: `
    <div class="border-b border-gray-200 flex gap-4">
      @for (tab of tabs(); track tab.label()) {
        <button
          (click)="activateTab(tab)"
          class="px-4 py-2 border-b-2 transition-colors font-medium"
          [class.border-blue-600]="tabState.activeTab() === tab.label()"
          [class.text-blue-600]="tabState.activeTab() === tab.label()"
          [class.border-transparent]="tabState.activeTab() !== tab.label()"
        >
          {{ tab.label() }}
        </button>
      }
    </div>

    <ng-content />
  `,
})
export class TabGroup {
  tabState = inject(TabState);
  tabs = contentChildren(Tab);

  protected activateTab(tab: Tab) {
    this.tabState.activeTab.set(tab.label());
  }

  constructor() {
    effect(() => {
      const firstTab = this.tabs()[0];

      if (firstTab && !this.tabState.activeTab()) {
        this.tabState.activeTab.set(firstTab.label());
      }
    });
  }
}
