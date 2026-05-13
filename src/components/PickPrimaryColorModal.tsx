import {
  CheckIcon,
  ColorSwatch,
  Group,
  getThemeColor,
  Modal,
  useMantineTheme,
} from '@mantine/core';
import { usePrimaryColor } from '#/contexts/primaryColorContext';
import { primaryColors } from '#/utils/primaryColors';

export const PickPrimaryColorModal = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  const theme = useMantineTheme();
  const { primaryColor, setPrimaryColor } = usePrimaryColor();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={'Pick Primary Color'}
      size={'sm'}
    >
      <Group gap={'xs'}>
        {primaryColors.map((color) => (
          <ColorSwatch
            key={'color'}
            component={'button'}
            style={{ color: 'white', cursor: 'pointer' }}
            radius={'sm'}
            size={49.67}
            color={getThemeColor(color, theme)}
            onClick={() => setPrimaryColor(color)}
          >
            {primaryColor === color && <CheckIcon size={12} />}
          </ColorSwatch>
        ))}
      </Group>
    </Modal>
  );
};
