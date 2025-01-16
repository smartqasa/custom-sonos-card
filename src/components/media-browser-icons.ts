import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import Store from '../model/store';
import { CardConfig, MediaPlayerItem } from '../types';
import { customEvent } from '../utils/utils';
import { MEDIA_ITEM_SELECTED } from '../constants';
import { itemsWithFallbacks, renderMediaBrowserItem } from '../utils/media-browser-utils';
import { styleMap } from 'lit-html/directives/style-map.js';

export class MediaBrowserIcons extends LitElement {
  @property({ attribute: false }) store!: Store;
  @property({ attribute: false }) items!: MediaPlayerItem[];
  private config!: CardConfig;

  render() {
    this.config = this.store.config;

    const items = itemsWithFallbacks(this.items, this.config);
    //let prevType: string | undefined = '';
    this.sortItemsByFavoriteTypeIfConfigured(items);
    return html`
      <div class="icons">
        ${items.map((item) => {
          //const showFavoriteType = (this.config.sortFavoritesByType && item.favoriteType !== prevType) || nothing;
          const toRender = html`
            <ha-control-button
              style=${this.buttonStyle(this.config.favoritesItemsPerRow || 4)}
              @click=${() => this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, item))}
            >
              ${renderMediaBrowserItem(item, !item.thumbnail || !this.config.favoritesHideTitleForThumbnailIcons)}
            </ha-control-button>
          `;
          //prevType = item.favoriteType;
          return toRender;
        })}
      </div>
    `;
  }

  private sortItemsByFavoriteTypeIfConfigured(items: MediaPlayerItem[]) {
    if (this.config.sortFavoritesByType) {
      items.sort((a, b) => {
        return a.favoriteType?.localeCompare(b.favoriteType ?? '') || a.title.localeCompare(b.title);
      });
    }
  }

  private buttonStyle(favoritesItemsPerRow: number) {
    const margin = '1%';
    const size = `calc(100% / ${favoritesItemsPerRow} - ${margin} * 3)`;
    return styleMap({
      width: size,
      height: size,
      margin: margin,
      '--control-button-padding': 0,
    });
  }

  static get styles() {
    return [
      css`
        .icons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          padding: 0 1rem;
        }

        .thumbnail {
          width: 100%;
          padding-bottom: 100%;
          //margin: 0 6%;
          //background-size: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }

        .title {
          font-size: 0.8rem;
          position: absolute;
          width: 90%;
          line-height: 160%;
          bottom: 0;
          color: var(--primary-text-color);
          font-weight: 400;
          background-color: rgba(var(--rgb-card-background-color), 0.85);
        }
      `,
    ];
  }
}

customElements.define('sonos-media-browser-icons', MediaBrowserIcons);
