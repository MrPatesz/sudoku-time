import {
  ActionIcon,
  AspectRatio,
  darken,
  Group,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBrightnessHalf,
  IconMenu2,
  IconRotate,
  IconRotateClockwise2,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { usePuzzle } from '#/hooks/usePuzzle';
import { getIndices } from '#/utils/getIndices';

function Cell({
  digit,
  index,
  selectedIndex,
  onClick,
  selectedDigit,
  isOriginal,
}: {
  digit: number;
  index: number;
  selectedIndex: number;
  onClick: () => void;
  selectedDigit: number;
  isOriginal: boolean;
}) {
  const {
    rowIndex: selectedRowIndex,
    colIndex: selectedColIndex,
    boxIndex: selectedBoxIndex,
  } = getIndices(selectedIndex);
  const { colIndex, rowIndex, boxIndex } = getIndices(index);

  const selectedIndirectly =
    rowIndex === selectedRowIndex ||
    colIndex === selectedColIndex ||
    boxIndex === selectedBoxIndex;

  const theme = useMantineTheme();
  const scheme = useComputedColorScheme();

  const bg = (() => {
    const delta = scheme === 'light' ? 0 : 1;
    if (index === selectedIndex) {
      return theme.colors[theme.primaryColor]?.[3 + delta];
    } else if (selectedDigit && selectedDigit === digit) {
      return theme.colors[theme.primaryColor]?.[2 + delta];
    } else if (selectedIndirectly) {
      return theme.colors[theme.primaryColor]?.[1 + delta];
    }
  })();

  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        border: '1px solid grey',
        borderLeft: colIndex % 3 || !colIndex ? undefined : '4px solid grey',
        borderTop: rowIndex % 3 || !rowIndex ? undefined : '4px solid grey',
      }}
      bg={scheme === 'dark' ? bg && darken(bg, 0.5) : bg}
      p={0}
    >
      <Text size={'32px'} ta={'center'} fw={isOriginal ? 'bold' : undefined}>
        {digit || null}
      </Text>
    </UnstyledButton>
  );
}

export function Sudoku() {
  const { toggleColorScheme } = useMantineColorScheme();
  const [selected, setSelected] = useState<number>(0);
  const { current, original, restart, startNew, update } = usePuzzle();

  const selectedDigit = current[selected];

  const solved = current.every((digit) => digit);

  const digitCounts = current.reduce(
    (acc, digit) => {
      acc[digit] = (acc[digit] ?? 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      'keydown',
      (e) => {
        const digit = Number(e.key);
        if (!Number.isNaN(digit)) {
          update(selected, digit);
        }
        // TODO arrows
      },
      controller,
    );

    return () => controller.abort();
  }, [selected, update]);

  return (
    <Stack>
      <AspectRatio maw={600}>
        <SimpleGrid
          cols={9}
          spacing={0}
          verticalSpacing={0}
          bd={'4px solid grey'}
        >
          {current.map((digit, index) => (
            <Cell
              key={index}
              digit={digit}
              index={index}
              selectedIndex={solved ? index : selected}
              onClick={() => setSelected(index)}
              selectedDigit={selectedDigit}
              isOriginal={original[index] === digit}
            />
          ))}
        </SimpleGrid>
      </AspectRatio>
      <Group gap={'xs'}>
        {Array.from({ length: 10 }).map((_, digit) => (
          <ActionIcon
            key={digit}
            size={'xl'}
            variant={'default'}
            onClick={() => update(selected, digit)}
            disabled={
              Boolean(original[selected]) || digitCounts[digit] === 9 || solved
            }
          >
            {digit}
          </ActionIcon>
        ))}
        <Menu>
          <Menu.Target>
            <ActionIcon size={'xl'} variant={'default'}>
              <IconMenu2 />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                if (confirm('Are you sure you want to restart?')) {
                  restart();
                }
              }}
              leftSection={<IconRotate />}
            >
              Restart
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                if (
                  confirm('Are you sure you want to start the next puzzle?')
                ) {
                  startNew();
                }
              }}
              leftSection={<IconRotateClockwise2 />}
            >
              New
            </Menu.Item>
            <Menu.Item
              onClick={toggleColorScheme}
              leftSection={<IconBrightnessHalf />}
            >
              Colors
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Stack>
  );
}
