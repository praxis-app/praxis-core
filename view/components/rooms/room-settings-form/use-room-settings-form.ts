// TODO: Add support for Knock and Restricted join rule options

import { useMatrixClient } from '@/hooks/use-matrix-client';
import { useRoomDirectoryVisibility } from '@/hooks/use-room-directory-visibility';
import { useRoomName } from '@/hooks/use-room-name';
import { useRoomState } from '@/hooks/use-room-state';
import { getRoomTopic } from '@/lib/room.utilts';
import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EventType,
  GuestAccess,
  JoinRule,
  Room,
  Visibility,
} from 'matrix-js-sdk';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as zod from 'zod';

const roomSettingsFormSchema = zod.object({
  name: zod
    .string()
    .min(3, {
      message: t('rooms.errors.roomNameMin'),
    })
    .max(50, {
      message: t('rooms.errors.roomNameMax'),
    }),
  topic: zod.string().max(500, {
    message: t('rooms.errors.roomTopicMax'),
  }),
  visibility: zod.enum([Visibility.Public, Visibility.Private, ''], {
    required_error: t('rooms.errors.roomVisibility'),
  }),
  joinRule: zod.enum([JoinRule.Public, JoinRule.Invite], {
    required_error: t('rooms.errors.roomAccess'),
  }),
  guestAccess: zod.enum([GuestAccess.CanJoin, GuestAccess.Forbidden], {
    required_error: t('rooms.errors.roomGuestAccess'),
  }),
});

export type RoomSettingsFormValues = zod.infer<typeof roomSettingsFormSchema>;

export const useRoomSettingsForm = (
  room: Room,
  { onSuccess }: { onSuccess?: () => void } = {},
) => {
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const form = useForm<RoomSettingsFormValues>({
    resolver: zodResolver(roomSettingsFormSchema),
    defaultValues: {
      name: room.name,
      topic: getRoomTopic(room),
      joinRule: room.getJoinRule() as JoinRule.Public | JoinRule.Invite,
      guestAccess: room.getGuestAccess(),
      visibility: '',
    },
  });

  const roomName = useRoomName(room, {
    onSuccess: (name) => form.setValue('name', name),
  });
  const roomTopic = useRoomState(room, {
    getValue: getRoomTopic,
    onUpdate: (topic) => form.setValue('topic', topic),
  });
  const roomVisibility = useRoomDirectoryVisibility(room, {
    onSuccess: (visibility) => form.setValue('visibility', visibility),
  });
  const roomJoinRule = useRoomState(room, {
    getValue: (room) => room.getJoinRule() as JoinRule.Public | JoinRule.Invite,
    onUpdate: (joinRule) => form.setValue('joinRule', joinRule),
  });
  const roomGuestAccess = useRoomState(room, {
    getValue: (room) => room.getGuestAccess(),
    onUpdate: (guestAccess) => form.setValue('guestAccess', guestAccess),
  });

  const hasUnsupportedJoinRule =
    roomJoinRule !== JoinRule.Public && roomJoinRule !== JoinRule.Invite;

  const handleSubmit = async (values: RoomSettingsFormValues) => {
    try {
      if (values.name && values.name !== roomName) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomName,
          { name: values.name },
          '',
        );
      }
      const currentTopic = roomTopic || '';
      const newTopic = values.topic || '';
      if (newTopic !== currentTopic) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomTopic,
          { topic: newTopic },
          '',
        );
      }
      if (values.joinRule && values.joinRule !== roomJoinRule) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomJoinRules,
          { join_rule: values.joinRule },
          '',
        );
      }
      if (values.visibility && values.visibility !== roomVisibility) {
        await matrixClient.setRoomDirectoryVisibility(
          room.roomId,
          values.visibility,
        );
      }
      if (values.guestAccess !== roomGuestAccess) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomGuestAccess,
          { guest_access: values.guestAccess },
          '',
        );
      }

      toast(t('rooms.toasts.roomUpdated'));
      onSuccess?.();
    } catch {
      toast(t('rooms.toasts.roomUpdatedError'), {
        description: t('rooms.toasts.roomUpdatedErrorDescription'),
      });
    }
  };

  return {
    form,
    handleSubmit,
    hasUnsupportedJoinRule,
  };
};
