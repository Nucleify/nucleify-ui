import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  type NuiTabsHandlers,
  type NuiTabsViewState,
  renderTabs,
} from './logic.js';
import type {
  TabListInterface,
  TabPanelInterface,
  TabsProps,
} from './types.js';

const styles = createComponentStyles(
  'nui-tabs',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-tabs')
export class NuiTabs extends LitElement implements TabsProps {
  @property({ type: Array }) lists?: TabListInterface[] = [];
  @property({ type: Array }) panels?: TabPanelInterface[] = [];
  @property({ type: String }) value?: string | number;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  @state() activeValue: string | number = '';

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected firstUpdated() {
    this.initializeActiveValue();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('value')) {
      if (this.value !== undefined) {
        this.activeValue = this.value;
      }
    }

    if (changed.has('lists')) {
      this.initializeActiveValue();
    }
  }

  private initializeActiveValue() {
    if (this.value !== undefined) {
      this.activeValue = this.value;
    } else if (this.lists && this.lists.length > 0) {
      this.activeValue = this.lists[0].value;
    }
  }

  private handleTabClick(val: string | number) {
    this.activeValue = val;
    this.value = val;
    this.dispatchEvent(
      new CustomEvent('nui-change', {
        detail: { value: val },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private get _handlers(): NuiTabsHandlers {
    return {
      onTabClick: (val) => this.handleTabClick(val),
    };
  }

  render() {
    const viewState: NuiTabsViewState = {
      lists: this.lists,
      panels: this.panels,
      value: this.value,
      unstyled: this.unstyled,
      nuiType: this.nuiType,
      activeValue: this.activeValue,
    };

    return renderTabs(viewState, this._handlers);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-tabs': NuiTabs;
  }
}
