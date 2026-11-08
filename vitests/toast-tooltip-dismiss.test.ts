import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../dist/components/nui-toast/nui-toast.js';
import '../dist/components/nui-tooltip/nui-tooltip.js';
import type { NuiToast } from '../src/components/nui-toast/nui-toast.js';
import type { NuiTooltip } from '../src/components/nui-tooltip/nui-tooltip.js';
import { cleanup } from './helpers.js';

describe('nui-toast & nui-tooltip single active item behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  describe('nui-toast', () => {
    it('dismisses previous toast completely before showing new toast by default', async () => {
      const toast = document.createElement('nui-toast') as NuiToast;
      document.body.appendChild(toast);
      await toast.updateComplete;

      // 1. Add first toast
      toast.add({ summary: 'First', detail: 'First message', life: 3000 });
      expect(toast.messages.length).toBe(1);
      expect(toast.messages[0].summary).toBe('First');
      expect(toast.messages[0].closing).toBe(false);

      // 2. Add second toast while first is still visible
      toast.add({ summary: 'Second', detail: 'Second message', life: 3000 });

      // First toast must be marked closing immediately
      expect(toast.messages.length).toBe(1);
      expect(toast.messages[0].closing).toBe(true);

      // Fast-forward 200ms (toast-fade-out duration)
      vi.advanceTimersByTime(200);

      // Previous toast has vanished, now only the second toast is shown
      expect(toast.messages.length).toBe(1);
      expect(toast.messages[0].summary).toBe('Second');
      expect(toast.messages[0].closing).toBe(false);
    });

    it('handles rapid repeated triggers without accumulating stacked toasts', async () => {
      const toast = document.createElement('nui-toast') as NuiToast;
      document.body.appendChild(toast);
      await toast.updateComplete;

      // Simulate 7 rapid clicks (like clicking "Copy code" 7 times)
      for (let i = 1; i <= 7; i++) {
        toast.add({ summary: `Click ${i}`, detail: 'Copied' });
      }

      // There should not be 7 stacked toasts
      expect(toast.messages.length).toBe(1);
      expect(toast.messages[0].closing).toBe(true);

      // Once fade-out finishes, only the latest toast remains
      vi.advanceTimersByTime(200);
      expect(toast.messages.length).toBe(1);
      expect(toast.messages[0].summary).toBe('Click 7');
      expect(toast.messages[0].closing).toBe(false);
    });

    it('allows stacking when multiple=true', async () => {
      const toast = document.createElement('nui-toast') as NuiToast;
      toast.multiple = true;
      document.body.appendChild(toast);
      await toast.updateComplete;

      toast.add({ summary: 'Msg 1' });
      toast.add({ summary: 'Msg 2' });

      expect(toast.messages.length).toBe(2);
      expect(toast.messages[0].summary).toBe('Msg 1');
      expect(toast.messages[1].summary).toBe('Msg 2');
    });

    it('clears all active toasts via clear() and nui-toast-clear event', async () => {
      const toast = document.createElement('nui-toast') as NuiToast;
      document.body.appendChild(toast);
      await toast.updateComplete;

      toast.add({ summary: 'Active toast' });
      expect(toast.messages.length).toBe(1);

      window.dispatchEvent(new CustomEvent('nui-toast-clear'));
      expect(toast.messages.length).toBe(0);
    });
  });

  describe('nui-tooltip', () => {
    it('dismisses previously active tooltip when a new tooltip is shown', async () => {
      const tooltip1 = document.createElement('nui-tooltip') as NuiTooltip;
      tooltip1.value = 'Tooltip 1';
      const trigger1 = document.createElement('button');
      trigger1.textContent = 'Btn 1';
      tooltip1.appendChild(trigger1);

      const tooltip2 = document.createElement('nui-tooltip') as NuiTooltip;
      tooltip2.value = 'Tooltip 2';
      const trigger2 = document.createElement('button');
      trigger2.textContent = 'Btn 2';
      tooltip2.appendChild(trigger2);

      document.body.appendChild(tooltip1);
      document.body.appendChild(tooltip2);
      await Promise.all([tooltip1.updateComplete, tooltip2.updateComplete]);

      // Show tooltip 1
      const triggerEl1 = tooltip1.shadowRoot?.querySelector(
        '.nui-tooltip-trigger',
      ) as HTMLElement;
      triggerEl1?.dispatchEvent(new MouseEvent('mouseenter'));
      expect(tooltip1.visible).toBe(true);
      expect(tooltip2.visible).toBe(false);

      // Now show tooltip 2
      const triggerEl2 = tooltip2.shadowRoot?.querySelector(
        '.nui-tooltip-trigger',
      ) as HTMLElement;
      triggerEl2?.dispatchEvent(new MouseEvent('mouseenter'));

      // Tooltip 1 must be closed, Tooltip 2 becomes visible
      expect(tooltip1.visible).toBe(false);
      expect(tooltip2.visible).toBe(true);
    });
  });
});
