// TODO: Add remaining layout and functionality - below is a WIP

import { KeyCodes } from '@/constants/shared.constants';
import { cn, t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BiSolidSend } from 'react-icons/bi';
import { MdAdd, MdImage, MdPoll } from 'react-icons/md';
import { TbMicrophoneFilled } from 'react-icons/tb';
import { toast } from 'sonner';
import * as zod from 'zod';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Form, FormField } from '../ui/form';
import { Textarea } from '../ui/textarea';

const MESSAGE_BODY_MAX = 6000;

const formSchema = zod.object({
  body: zod
    .string()
    .max(MESSAGE_BODY_MAX, {
      message: t('messages.errors.longBody'),
    })
    // TODO: Remove nonempty check once images are supported
    .nonempty(),
});

export const MessageForm = () => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: '',
    },
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

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    if (!values.body.trim()) {
      return;
    }
    try {
      console.log('TODO: Implement message sending');
    } catch {
      toast(t('messages.errors.errorSendingMessage'), {
        description: t('prompts.tryAgain'),
      });
    }
    form.reset();
  };

  const handleInputKeyDown: KeyboardEventHandler = (e) => {
    if (e.code !== KeyCodes.Enter) {
      return;
    }
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
    form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-center gap-2 overflow-y-auto border-t p-2 pt-2.5 pb-4"
      >
        <Dialog open={showProposalForm} onOpenChange={setShowProposalForm}>
          <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
            <DropdownMenuTrigger className="bg-input/30 hover:bg-input/40 inline-flex size-11 cursor-pointer items-center justify-center rounded-full p-2 px-3 focus:outline-none [&_svg]:shrink-0">
              <MdAdd
                className={cn(
                  'text-muted-foreground size-7 transition-transform duration-200',
                  showMenu && 'rotate-45',
                )}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-52"
              align="start"
              alignOffset={-1}
              side="top"
              sideOffset={20}
            >
              <DialogTrigger asChild>
                <DropdownMenuItem className="text-md">
                  <MdPoll className="text-foreground size-5" />
                  {t('proposals.actions.create')}
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="pt-10 md:pt-6">
            <DialogHeader>
              <DialogTitle>{t('proposals.headers.create')}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              {t('proposals.descriptions.create')}
            </DialogDescription>
          </DialogContent>
        </Dialog>

        <div className="bg-input/30 flex w-full items-center rounded-3xl px-2">
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder={t('messages.placeholders.sendMessage')}
                className="min-h-12 resize-none border-none bg-transparent py-3 shadow-none focus-visible:border-none focus-visible:ring-0 md:py-3.5 dark:bg-transparent"
                onKeyDown={handleInputKeyDown}
                ref={inputRef}
                rows={1}
              />
            )}
          />

          <Button
            size="icon"
            className="rounded-full"
            variant="ghost"
            disabled={form.formState.isSubmitting}
            onClick={() => toast(t('prompts.inDev'))}
          >
            <MdImage className="text-muted-foreground size-6" />
          </Button>
        </div>

        {form.formState.isValid ? (
          <Button
            type="submit"
            className="mx-0.5 size-10 rounded-full"
            disabled={form.formState.isSubmitting}
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
