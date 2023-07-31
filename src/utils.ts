import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { CardConfig, PlayerGroup, Section } from './types';
import { ACTIVE_PLAYER_EVENT, BROWSE_CLICKED, PLAY_DIR, REQUEST_PLAYER_EVENT, SHOW_SECTION } from './constants';

export function getEntityName(hass: HomeAssistant, config: CardConfig, entity: string) {
  const name = hass.states[entity].attributes.friendly_name || '';
  if (config.entityNameRegexToReplace) {
    return name.replace(new RegExp(config.entityNameRegexToReplace, 'g'), config.entityNameReplacement || '');
  }
  return name;
}

export function getGroupMembers(state: HassEntity) {
  return state.attributes.sonos_group || state.attributes.group_members;
}

export function listenForPlayerRequest(listener: EventListener) {
  window.addEventListener(REQUEST_PLAYER_EVENT, listener);
}

export function stopListeningForPlayerRequest(listener: EventListener) {
  window.removeEventListener(REQUEST_PLAYER_EVENT, listener);
}

export function dispatchShowSection(section: Section) {
  window.dispatchEvent(new CustomEvent(SHOW_SECTION, { detail: section }));
}

export function dispatchPlayDir() {
  window.dispatchEvent(new CustomEvent(PLAY_DIR));
}
export function dispatchBrowseClicked() {
  window.dispatchEvent(new CustomEvent(BROWSE_CLICKED));
}

export function isPlaying(state: string) {
  return state === 'playing';
}

export function getCurrentTrack(hassEntity: HassEntity) {
  const attributes = hassEntity.attributes;
  return `${attributes.media_artist || ''} - ${attributes.media_title || ''}`.replace(/^ - /g, '');
}

export function getSpeakerList(group: PlayerGroup, config: CardConfig) {
  const entities = [group.entity, ...Object.keys(group.members)].sort();
  if (config.predefinedGroups?.length) {
    const found = config.predefinedGroups.find((pg) => {
      return pg.entities.sort().toString() === entities.toString();
    });
    if (found) {
      return found.name;
    }
  }
  return [group.roomName, ...Object.values(group.members)].join(' + ');
}

export function dispatchActiveEntity(entityId: string) {
  const event = new CustomEvent(ACTIVE_PLAYER_EVENT, {
    bubbles: true,
    composed: true,
    detail: { entityId },
  });
  window.dispatchEvent(event);
}
