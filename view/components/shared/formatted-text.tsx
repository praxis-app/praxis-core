import { TruncationSizes } from '@/constants/shared.constants';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { cn } from '@/lib/shared.utils';
import {
  convertBoldToSpan,
  parseMarkdownText,
  urlifyText,
} from '@/lib/text.utils';
import { useEffect, useState } from 'react';

interface Props {
  text?: string | null;
  urlTrimSize?: number;
  className?: string;
}

const FormattedText = ({ text, urlTrimSize, className }: Props) => {
  const [formattedText, setFormattedText] = useState<string>();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!text) {
      return;
    }
    const formatText = async () => {
      const urlSize =
        urlTrimSize || isDesktop
          ? TruncationSizes.Large
          : TruncationSizes.Medium;
      const urlified = urlifyText(text, urlSize);
      const markdown = await parseMarkdownText(urlified);
      const formatted = convertBoldToSpan(markdown);
      setFormattedText(formatted);
    };
    formatText();
  }, [text, isDesktop, urlTrimSize]);

  if (!formattedText) {
    return null;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: formattedText }}
      className={cn('whitespace-pre-wrap', className)}
    />
  );
};

export default FormattedText;
