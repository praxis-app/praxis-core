import { RemoveCircle } from '@mui/icons-material';
import { Box, IconButton, SxProps } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useImageSrc } from '../../hooks/image.hooks';
import { Image } from '../../types/image.types';

const REMOVE_BUTTON_STYLES: SxProps = {
  position: 'absolute',
  borderRadius: '60%',
  right: -21,
  top: -21,
};

const RemoveButton = ({ onClick }: { onClick(): void }) => {
  const { t } = useTranslation();

  return (
    <IconButton
      aria-label={t('images.labels.removeImage')}
      onClick={onClick}
      sx={REMOVE_BUTTON_STYLES}
    >
      <RemoveCircle />
    </IconButton>
  );
};

const SavedImagePreview = ({
  savedImage: { id, filename },
  containerStyles,
  handleDelete,
}: {
  containerStyles: SxProps;
  handleDelete?(id: string): void;
  savedImage: Image;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const src = useImageSrc(id, ref);

  return (
    <Box ref={ref} sx={containerStyles}>
      <img alt={filename} src={src} width="100%" />
      {handleDelete && <RemoveButton onClick={() => handleDelete(id)} />}
    </Box>
  );
};

interface Props {
  handleDelete?: (id: string) => void;
  handleRemove?: (imageName: string) => void;
  imageContainerStyles?: SxProps;
  savedImages?: Image[];
  selectedImages: File[];
  sx?: SxProps;
}

const AttachedImagePreview = ({
  handleDelete,
  handleRemove,
  imageContainerStyles,
  savedImages,
  selectedImages,
  sx,
}: Props) => {
  const { t } = useTranslation();

  const containerStyles: SxProps = {
    marginBottom: 2.5,
    marginRight: 3.5,
    position: 'relative',
    width: 170,
    ...imageContainerStyles,
  };

  return (
    <Box
      aria-label={t('images.labels.attachedImagePreview')}
      role="img"
      sx={{
        marginTop: 2,
        display: 'flex',
        flexWrap: 'wrap',
        ...sx,
      }}
    >
      {savedImages &&
        savedImages.map((savedImage) => (
          <SavedImagePreview
            key={savedImage.id}
            containerStyles={containerStyles}
            handleDelete={handleDelete}
            savedImage={savedImage}
          />
        ))}

      {selectedImages.map((image) => (
        <Box sx={containerStyles} key={image.name}>
          <img alt={image.name} src={URL.createObjectURL(image)} width="100%" />
          {handleRemove && (
            <RemoveButton onClick={() => handleRemove(image.name)} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default AttachedImagePreview;
