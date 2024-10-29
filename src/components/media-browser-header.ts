import { css, html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { MediaPlayerEntityFeature } from '../types';
import Store from '../model/store';

class MediaBrowserHeader extends LitElement {
  @property({ attribute: false }) store!: Store;

  render() {
    return html`
      <!-- <div class="title">${this.store.config.mediaBrowserTitle ?? 'All Favorites'}</div> -->
      <sonos-ha-player
        hide=${this.store.config.hideBrowseMediaButton || nothing}
        .store=${this.store}
        .features=${[MediaPlayerEntityFeature.BROWSE_MEDIA]}
      ></sonos-ha-player>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
      }
      .title {
        flex: 1;
        text-align: center;
        font-size: var(--sq-primary-font-size);
        font-weight: var(--sq-primary-font-weight);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
      }
      *[hide] {
        display: none;
      }
    `;
  }
}

customElements.define('sonos-media-browser-header', MediaBrowserHeader);
