import { CardConfig, MediaPlayerItem } from '../types';
import HassService from './hass-service';
import { MediaPlayer } from '../model/media-player';
import { stringContainsAnyItemInArray } from '../utils/media-browser-utils';

export default class MediaBrowseService {
  private hassService: HassService;
  private config: CardConfig;

  constructor(hassService: HassService, config: CardConfig) {
    this.hassService = hassService;
    this.config = config;
  }

  async getFavorites(player: MediaPlayer): Promise<MediaPlayerItem[]> {
    if (!player) {
      return [];
    }
    let favorites = await this.getFavoritesForPlayer(player);
    favorites = favorites.flatMap((f) => f);
    favorites = this.removeDuplicates(favorites);
    favorites = favorites.length ? favorites : this.getFavoritesFromStates(player);
    const favoritesToIgnore = this.config.favoritesToIgnore ?? [];
    return favorites.filter((item) => {
      const titleNotIgnored = !stringContainsAnyItemInArray(favoritesToIgnore, item.title);
      const contentIdNotIgnored = !stringContainsAnyItemInArray(favoritesToIgnore, item.media_content_id ?? '');
      return titleNotIgnored && contentIdNotIgnored;
    });
  }

  private removeDuplicates(items: MediaPlayerItem[]) {
    return items.filter((item, index, all) => {
      return index === all.findIndex((current) => current.title === item.title);
    });
  }

  private async getFavoritesForPlayer(player: MediaPlayer) {
    try {
      const root = await this.hassService.browseMedia(player);
      const favorites = root.children?.find(
        (child) =>
          child.media_content_type?.toLowerCase() === 'favorites' ||
          child.media_content_id?.toLowerCase() === 'favorites' ||
          child.title.toLowerCase() === 'favorites',
      );
      if (!favorites) {
        return [];
      }
      const favoritesRoot = await this.hassService.browseMedia(player, favorites.media_content_type, '');
      const favoriteTypesPromise = favoritesRoot.children?.map((favoriteItem) =>
        this.hassService.browseMedia(player, favoriteItem.media_content_type, favoriteItem.media_content_id),
      );
      const favoriteTypes = favoriteTypesPromise ? await Promise.all(favoriteTypesPromise) : [];
      return favoriteTypes.flatMap((item) => item.children ?? []);
    } catch (e) {
      console.error(`Sonos Card: error getting favorites for player ${player.id}: ${JSON.stringify(e)}`);
      return [];
    }
  }

  private getFavoritesFromStates(mediaPlayer: MediaPlayer) {
    const titles = mediaPlayer.attributes.source_list ?? [];
    return titles.map((title: string) => ({ title }));
  }
}
