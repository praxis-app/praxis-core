// TODO: Add remaining layout and functionality - below is a WIP

import { Send } from '@mui/icons-material';
import {
  Box,
  debounce,
  IconButton,
  Input,
  SxProps,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import { GENERAL_CHANNEL_NAME } from '../../constants/channel.constants';
import { KeyCodes } from '../../constants/shared.constants';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import { Image } from '../../types/image.types';
import { MessagesQuery } from '../../types/message.types';
import { validateImageInput } from '../../utils/image.utils';
import ChooseAuthModal from '../auth/choose-auth-modal';
import AttachedImagePreview from '../images/attached-image-preview';
import ImageInput from '../images/image-input';

const MESSAGE_BODY_MAX = 6000;

interface FormValues {
  body: string;
}

interface Props {
  channelId: string;
  onSend?(): void;
  isGeneralChannel?: boolean;
}

const MessageForm = ({ channelId, onSend, isGeneralChannel }: Props) => {
  const { isLoggedIn, inviteToken, setToast } = useAppStore((state) => state);

  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [imagesInputKey, setImagesInputKey] = useState<number>();
  const [images, setImages] = useState<File[]>([]);

  const { t } = useTranslation();
  const inputRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const isDarkMode = useIsDarkMode();

  const { handleSubmit, register, setValue, formState, reset, getValues } =
    useForm<FormValues>({ mode: 'onChange' });

  const { onChange, ...registerBodyProps } = register('body', {
    maxLength: {
      value: MESSAGE_BODY_MAX,
      message: t('messages.errors.longBody'),
    },
  });

  const isEmptyBody = !getValues('body') && !formState.dirtyFields.body;
  const isEmpty = isEmptyBody && !images.length;
  const draftKey = `message-draft-${channelId}`;

  const { mutate: sendMessage, isPending: isMessageSending } = useMutation({
    mutationFn: async ({ body }: FormValues) => {
      validateImageInput(images);

      const { message } = await api.sendMessage(channelId, body, images.length);
      const messageImages: Image[] = [];

      if (images.length && message.images) {
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.set('file', images[i]);

          const placeholder = message.images[i];
          const { image } = await api.uploadMessageImage(
            channelId,
            message.id,
            placeholder.id,
            formData,
          );
          messageImages.push(image);
        }
        setImagesInputKey(Date.now());
        setImages([]);
      }

      const messageWithImages = {
        ...message,
        images: messageImages,
      };

      const resolvedChannelId = isGeneralChannel
        ? GENERAL_CHANNEL_NAME
        : channelId;

      queryClient.setQueryData<MessagesQuery>(
        ['messages', resolvedChannelId],
        (oldData) => {
          if (!oldData) {
            return {
              pages: [{ messages: [messageWithImages] }],
              pageParams: [0],
            };
          }
          const pages = oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                messages: [messageWithImages, ...page.messages],
              };
            }
            return page;
          });
          return { pages, pageParams: oldData.pageParams };
        },
      );
      localStorage.removeItem(draftKey);
      setValue('body', '');
      onSend?.();
      reset();
    },
    onError: (error: Error) => {
      setToast({
        title: error.message,
        status: 'error',
      });
    },
  });

  const { data: isFirstUserData } = useQuery({
    queryKey: ['is-first-user'],
    queryFn: api.isFirstUser,
    enabled: !isLoggedIn,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      if (
        ['Space', 'Enter', 'Key', 'Digit'].some((key) =>
          e.code.includes(key),
        ) &&
        // Allow for Ctrl + C to copy
        e.code !== 'KeyC'
      ) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      setValue('body', draft);
    }
  }, [setValue, draftKey]);

  const formStyles: SxProps = {
    borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}`,
    transition: 'background-color 0.2s cubic-bezier(.4,0,.2,1)',
    bgcolor: 'background.paper',
    overflowY: 'auto',
    paddingTop: 1,
    paddingBottom: 2,
    paddingX: 0.9,
    width: '100%',
  };
  const inputStyles: SxProps = {
    borderRadius: 8,
    paddingY: 0.8,
    width: '100%',
  };
  const sendBtnStyles: SxProps = {
    width: 40,
    height: 40,
    transform: 'translateY(5px)',
  };

  const saveDraft = debounce((draft: string) => {
    localStorage.setItem(draftKey, draft);
  }, 100);

  const isDisabled = () => {
    if (isMessageSending) {
      return true;
    }
    return isEmpty;
  };

  const handleSendMessage = () => {
    if (isEmpty) {
      return;
    }
    if (!isLoggedIn) {
      if (!inviteToken && !isFirstUserData?.isFirstUser) {
        setToast({
          title: t('messages.prompts.inviteRequired'),
          status: 'info',
        });
        return;
      }
      setIsAuthPromptOpen(true);
      return;
    }
    handleSubmit((values) => sendMessage(values))();
  };

  const handleInputKeyDown: KeyboardEventHandler = (e) => {
    if (e.code !== KeyCodes.Enter) {
      return;
    }
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
    handleSendMessage();
  };

  const handleRemoveSelectedImage = (imageName: string) => {
    setImages(images.filter((image) => image.name !== imageName));
    setImagesInputKey(Date.now());
  };

  return (
    <Box sx={formStyles}>
      <Box
        bgcolor="background.secondary"
        sx={{ transition: 'background-color 0.2s cubic-bezier(.4,0,.2,1)' }}
        borderRadius={4}
        paddingX={1.5}
        paddingY={0.2}
        flex={1}
      >
        <Input
          {...registerBodyProps}
          autoComplete="off"
          placeholder={t('messages.prompts.sendAMessage')}
          onKeyDown={handleInputKeyDown}
          onChange={(e) => {
            saveDraft(e.target.value);
            onChange(e);
          }}
          sx={inputStyles}
          inputRef={inputRef}
          disableUnderline
          multiline
        />

        {!!formState.errors.body && (
          <Typography color="error" fontSize="small">
            {formState.errors.body.message}
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between">
          <ImageInput
            key={imagesInputKey}
            setImages={setImages}
            iconStyles={{ fontSize: 25, color: 'text.secondary' }}
            multiple
          />

          <IconButton
            sx={sendBtnStyles}
            onClick={handleSendMessage}
            disabled={isDisabled()}
            disableRipple
            edge="end"
          >
            <Send sx={{ fontSize: 20, color: 'text.secondary' }} />
          </IconButton>
        </Box>
      </Box>

      {!!images.length && (
        <AttachedImagePreview
          handleRemove={handleRemoveSelectedImage}
          selectedImages={images}
          sx={{ marginLeft: 1.5 }}
        />
      )}

      <ChooseAuthModal
        isOpen={isAuthPromptOpen}
        setIsOpen={setIsAuthPromptOpen}
        sendMessage={handleSubmit((values) => sendMessage(values))}
      />
    </Box>
  );
};

export default MessageForm;
