// TODO: Add remaining layout and functionality - below is a WIP

import { api } from '@/client/api-client';
import { GENERAL_CHANNEL_NAME } from '@/constants/channel.constants';
import { KeyCodes } from '@/constants/shared.constants';
import { validateImageInput } from '@/lib/image.utilts';
import { cn, debounce, t } from '@/lib/shared.utils';
import { useAppStore } from '@/store/app.store';
import { Image } from '@/types/image.types';
import { MessagesQuery } from '@/types/message.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BiSolidSend } from 'react-icons/bi';
import { MdAdd } from 'react-icons/md';
import { TbMicrophoneFilled } from 'react-icons/tb';
import { toast } from 'sonner';
import * as zod from 'zod';
import { ChooseAuthDialog } from '../auth/choose-auth-dialog';
import { AttachedImagePreview } from '../images/attached-image-preview';
import { ImageInput } from '../images/image-input';
import { Button } from '../ui/button';
import { Form, FormField } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { MessageFormMenu } from './message-form-menu';

const MESSAGE_BODY_MAX = 6000;

const formSchema = zod.object({
  body: zod.string().max(MESSAGE_BODY_MAX, {
    message: t('messages.errors.longBody'),
  }),
});

interface Props {
  channelId: string;
  onSend?(): void;
  isGeneralChannel?: boolean;
}

export const MessageForm = ({ channelId, onSend, isGeneralChannel }: Props) => {
  const { isLoggedIn, inviteToken } = useAppStore();

  const [showMenu, setShowMenu] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [imagesInputKey, setImagesInputKey] = useState<number>();
  const [images, setImages] = useState<File[]>([]);

  const { t } = useTranslation();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: '',
    },
  });

  const isEmptyBody =
    !form.getValues('body') && !form.formState.dirtyFields.body;
  const isEmpty = isEmptyBody && !images.length;

  // TODO: Remove when no longer needed for testing
  console.log(isEmpty);

  const draftKey = `message-draft-${channelId}`;

  const { mutate: sendMessage, isPending: isMessageSending } = useMutation({
    mutationFn: async ({ body }: zod.infer<typeof formSchema>) => {
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
      form.setValue('body', '');
      onSend?.();
      form.reset();
    },
    onError: (error: Error) => {
      toast(error.message);
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
      form.setValue('body', draft);
    }
  }, [form, draftKey]);

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
        toast(t('messages.prompts.inviteRequired'));
        return;
      }
      setIsAuthPromptOpen(true);
      return;
    }
    form.handleSubmit((values) => sendMessage(values))();
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
    <Form {...form}>
      <form className="flex w-full items-center gap-2 overflow-y-auto border-t p-2 pt-2.5 pb-4">
        <MessageFormMenu
          trigger={
            <MdAdd
              className={cn(
                'text-muted-foreground size-7 transition-transform duration-200',
                showMenu && 'rotate-45',
              )}
            />
          }
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />

        <div className="bg-input/30 flex w-full items-center rounded-3xl px-2">
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <Textarea
                placeholder={t('messages.placeholders.sendMessage')}
                className="min-h-12 resize-none border-none bg-transparent py-3 shadow-none focus-visible:border-none focus-visible:ring-0 md:py-3.5 dark:bg-transparent"
                onKeyDown={handleInputKeyDown}
                onChange={(e) => {
                  saveDraft(e.target.value);
                  field.onChange(e);
                }}
                ref={inputRef}
                rows={1}
              />
            )}
          />

          <ImageInput
            key={imagesInputKey}
            setImages={setImages}
            iconClassName="text-muted-foreground size-6"
            multiple
          />
        </div>

        {!!images.length && (
          <AttachedImagePreview
            handleRemove={handleRemoveSelectedImage}
            selectedImages={images}
            className="ml-1.5"
          />
        )}

        <ChooseAuthDialog
          isOpen={isAuthPromptOpen}
          setIsOpen={setIsAuthPromptOpen}
          sendMessage={form.handleSubmit((values) => sendMessage(values))}
        />

        {form.formState.isValid ? (
          <Button
            type="submit"
            className="mx-0.5 size-10 rounded-full"
            disabled={isDisabled()}
          >
            <BiSolidSend className="ml-0.5 size-5" />
          </Button>
        ) : (
          <Button
            className="bg-input/30 hover:bg-input/40 size-11 rounded-full"
            onClick={() => toast(t('prompts.inDev'))}
          >
            <TbMicrophoneFilled className="text-muted-foreground size-5.5" />
          </Button>
        )}
      </form>
    </Form>
  );
};
