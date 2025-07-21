import { EventTimeline, EventType, Room } from 'matrix-js-sdk';

export const getRoomState = (room?: Room) => {
  if (!room) {
    return;
  }
  const timeline = room.getLiveTimeline();
  return timeline.getState(EventTimeline.FORWARDS);
};

export const getRoomTopic = (room?: Room) => {
  const roomState = getRoomState(room);
  const topicEvent = roomState?.getStateEvents(EventType.RoomTopic, '');
  const topic: string = topicEvent ? topicEvent.getContent().topic : '';
  return topic;
};
