import { Typography, TypographyProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { TruncationSizes } from '../../constants/shared.constants';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import {
  convertBoldToSpan,
  parseMarkdownText,
  urlifyText,
} from '../../utils/text.utils';

interface Props extends TypographyProps {
  text?: string | null;
  urlTrimSize?: number;
}

const FormattedText = ({ text, urlTrimSize, ...typographyProps }: Props) => {
  const [formattedText, setFormattedText] = useState<string>();
  const isLarge = useAboveBreakpoint('md');

  useEffect(() => {
    if (!text) {
      return;
    }
    const formatText = async () => {
      const urlSize =
        urlTrimSize || isLarge ? TruncationSizes.Large : TruncationSizes.Medium;
      const urlified = urlifyText(text, urlSize);
      const markdown = await parseMarkdownText(urlified);
      const formatted = convertBoldToSpan(markdown);
      setFormattedText(formatted);
    };
    formatText();
  }, [text, isLarge, urlTrimSize]);

  if (!formattedText) {
    return null;
  }

  return (
    <Typography
      dangerouslySetInnerHTML={{ __html: formattedText }}
      whiteSpace="pre-wrap"
      {...typographyProps}
    />
  );
};

export default FormattedText;
