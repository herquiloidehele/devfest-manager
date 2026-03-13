import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appClickLogger]',
  host: {
    '(click)': 'handleClick()',
  },
})
export class ClickLogger {
  readonly eventName = input<string>('unknown_event');

  protected handleClick() {
    console.log('[ClickLogger] registered and click event for: ', this.eventName());
  }
}
