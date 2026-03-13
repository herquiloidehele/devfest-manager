import { Injectable, signal } from '@angular/core';

@Injectable()
export class TabState {
  activeTab = signal<string>('');

  public activateTab(tab: string) {
    this.activeTab.set(tab);
  }
}
