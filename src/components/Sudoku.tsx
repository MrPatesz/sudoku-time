import {
  ActionIcon,
  AspectRatio,
  darken,
  Flex,
  Menu,
  SimpleGrid,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import {
  IconBrightnessHalf,
  IconMenu2,
  IconRainbow,
  IconRefreshAlert,
  IconRotate,
  IconRotateClockwise2,
} from '@tabler/icons-react';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { usePuzzle } from '#/hooks/usePuzzle';
import { useStrict } from '#/hooks/useStrict';
import { getIndices } from '#/utils/getIndices';
import { PickPrimaryColorModal } from './PickPrimaryColorModal';

function Cell({
  digit,
  index,
  selectedIndex,
  onClick,
  selectedDigit,
  isOriginal,
  wrong,
}: {
  digit: number;
  index: number;
  selectedIndex: number;
  onClick: () => void;
  selectedDigit: number;
  isOriginal: boolean;
  wrong: boolean;
}) {
  const [strict] = useStrict();

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
      onFocus={onClick}
      style={{
        border: '1px solid grey',
        borderLeft: colIndex % 3 || !colIndex ? undefined : '4px solid grey',
        borderTop: rowIndex % 3 || !rowIndex ? undefined : '4px solid grey',
      }}
      bg={scheme === 'dark' ? bg && darken(bg, 0.5) : bg}
      p={0}
    >
      <Text
        size={'32px'}
        ta={'center'}
        fw={isOriginal ? 'bold' : undefined}
        style={{ color: strict && wrong ? 'red' : undefined }}
      >
        {digit || null}
      </Text>
    </UnstyledButton>
  );
}

const MenuButton = ({
  toggleColorPicker,
}: {
  toggleColorPicker: () => void;
}) => {
  const { toggleColorScheme } = useMantineColorScheme();
  const [strict, setStrict] = useStrict();
  const { restart, startNew } = usePuzzle();

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon size={'xl'} variant={'default'}>
          <IconMenu2 />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => setStrict((prev) => !prev)}
          leftSection={<IconRefreshAlert color={strict ? 'red' : undefined} />}
        >
          Mode
        </Menu.Item>
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
            if (confirm('Are you sure you want to start a new puzzle?')) {
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
          Shade
        </Menu.Item>
        <Menu.Item onClick={toggleColorPicker} leftSection={<IconRainbow />}>
          Color
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export function Sudoku() {
  const { height, width } = useViewportSize();

  const [showColorPicker, toggleColorPicker] = useReducer(
    (prev) => !prev,
    false,
  );
  const [selected, setSelected] = useState<number>(0);
  const { current, original, solution, update } = usePuzzle();

  const solved = useMemo(
    () => current.every((digit, index) => digit === solution?.[index]),
    [current, solution],
  );

  const digitCounts = useMemo(
    () =>
      current.reduce(
        (acc, digit) => {
          acc[digit] = (acc[digit] ?? 0) + 1;
          return acc;
        },
        {} as Record<number, number | undefined>,
      ),
    [current],
  );

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      'keydown',
      (e) => {
        const digit = Number(e.key);
        if (!Number.isNaN(digit)) {
          update(selected, digit);
        } else if (e.key.startsWith('Arrow')) {
          setSelected((prev) => {
            const { rowIndex, colIndex } = getIndices(prev);

            const getSelected = (rIndex: number, cIndex: number) => {
              const resolveIndex = (index: number) => {
                const minIndex = 0;
                const maxIndex = 8;

                return index < minIndex
                  ? maxIndex
                  : index > maxIndex
                    ? minIndex
                    : index;
              };
              return resolveIndex(rIndex) * 9 + resolveIndex(cIndex);
            };

            switch (e.key) {
              case 'ArrowUp': {
                return getSelected(rowIndex - 1, colIndex);
              }
              case 'ArrowDown': {
                return getSelected(rowIndex + 1, colIndex);
              }
              case 'ArrowLeft': {
                return getSelected(rowIndex, colIndex - 1);
              }
              case 'ArrowRight': {
                return getSelected(rowIndex, colIndex + 1);
              }
              default: {
                return prev;
              }
            }
          });
        }
      },
      controller,
    );

    return () => controller.abort();
  }, [selected, update]);

  const tall = height > width;

  const numPadSize = { width: 152, height: 206 } as const;

  return (
    <>
      <PickPrimaryColorModal
        opened={showColorPicker}
        onClose={toggleColorPicker}
      />
      <Flex
        style={{ flexDirection: tall ? 'column' : 'row' }}
        gap={'xs'}
        align={'center'}
        h={'100dvh'}
        p={'xs'}
      >
        <AspectRatio
          {...(tall
            ? { w: '100%', mah: height - (numPadSize.height + 3 * 10) }
            : { h: '100%', maw: width - (numPadSize.width + 3 * 10) })}
        >
          <SimpleGrid
            cols={9}
            spacing={0}
            verticalSpacing={0}
            bd={'4px solid grey'}
            w={'100%'}
            h={'100%'}
          >
            {current.map((digit, index) => (
              <Cell
                key={index}
                digit={digit}
                index={index}
                selectedIndex={solved ? index : selected}
                onClick={() => setSelected(index)}
                selectedDigit={current[selected]}
                isOriginal={original[index] === digit}
                wrong={!!digit && !!solution && digit !== solution[index]}
              />
            ))}
          </SimpleGrid>
        </AspectRatio>
        <SimpleGrid
          cols={3}
          spacing={'xs'}
          w={numPadSize.width}
          h={numPadSize.height}
        >
          {Array.from({ length: 9 }).map((_, index) => {
            const digit = index + 1;
            return (
              <ActionIcon
                key={digit}
                size={'xl'}
                variant={'default'}
                onClick={() => update(selected, digit)}
                disabled={
                  Boolean(original[selected]) ||
                  digitCounts[digit] === 9 ||
                  solved
                }
              >
                {digit}
              </ActionIcon>
            );
          })}
          <MenuButton toggleColorPicker={toggleColorPicker} />
          <ActionIcon
            size={'xl'}
            variant={'default'}
            onClick={() => update(selected, 0)}
            disabled={
              Boolean(original[selected]) || digitCounts[0] === 9 || solved
            }
          >
            0
          </ActionIcon>
        </SimpleGrid>
      </Flex>
    </>
  );
}
