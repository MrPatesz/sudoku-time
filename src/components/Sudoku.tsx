import {
  ActionIcon,
  AspectRatio,
  ColorSwatch,
  darken,
  em,
  Flex,
  getThemeColor,
  Input,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import {
  IconAlertSquare,
  IconAntennaBars4,
  IconBrightnessHalf,
  IconClockCheck,
  IconClockMinus,
  IconClockPlus,
  IconMenu2,
  IconPaint,
  IconPalette,
  IconRotate,
  IconRotateClockwise2,
} from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDifficulty } from '#/hooks/useDifficulty';
import { useHighlight } from '#/hooks/useHighlight';
import { usePrimaryColor } from '#/hooks/usePrimaryColor';
import { usePuzzle } from '#/hooks/usePuzzle';
import { useStrict } from '#/hooks/useStrict';
import { useTimer } from '#/hooks/useTimer';
import { getIndices } from '#/utils/getIndices';
import { primaryColors } from '#/utils/primaryColors';

function Cell({
  digit,
  onChange,
  index,
  selectedIndex,
  onClick,
  selectedDigit,
  isOriginal,
  wrong,
  foundAll,
}: {
  digit: number;
  onChange: (newDigit: number) => void;
  index: number;
  selectedIndex: number;
  onClick: () => void;
  selectedDigit: number;
  isOriginal: boolean;
  wrong: boolean;
  foundAll: boolean;
}) {
  const [strict] = useStrict();
  const [highlight] = useHighlight();

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
    } else if (selectedIndirectly && highlight) {
      return theme.colors[theme.primaryColor]?.[1 + delta];
    }
  })();

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (index === selectedIndex) {
      ref.current?.focus();
    }
  }, [index, selectedIndex]);

  const xs = useMediaQuery(`(min-width: ${em(300)})`);
  const sm = useMediaQuery(`(min-width: ${em(400)})`);
  const md = useMediaQuery(`(min-width: ${em(500)})`);

  return (
    <Input
      ref={ref}
      variant={'unstyled'}
      type={'number'}
      inputMode={'numeric'}
      readOnly={isOriginal}
      value={digit || ''}
      onChange={(e) => {
        const newNumber = Number(
          e.currentTarget.value.replace(digit.toString(), ''),
        );
        if (!Number.isNaN(newNumber)) {
          onChange(newNumber);
        }
      }}
      onKeyDown={(e) => {
        if (
          ![
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'Backspace',
            'Delete',
            'Tab',
          ].includes(e.key)
        ) {
          e.preventDefault();
        }
      }}
      onFocus={onClick}
      style={{
        border: '1px solid grey',
        borderLeft: colIndex % 3 || !colIndex ? undefined : '4px solid grey',
        borderTop: rowIndex % 3 || !rowIndex ? undefined : '4px solid grey',
      }}
      bg={scheme === 'dark' ? bg && darken(bg, 0.5) : bg}
      styles={{
        input: {
          height: '100%',
          fontSize: `${md ? 32 : sm ? 24 : xs ? 20 : 16}px`,
          textAlign: 'center',
          fontWeight: foundAll ? 'bold' : undefined,
          color:
            strict && wrong
              ? 'red'
              : !isOriginal
                ? theme.colors[theme.primaryColor]?.[8]
                : undefined,
          userSelect: 'none',
          minHeight: 0,
        },
      }}
    />
  );
}

const difficulties = ['Easy', 'Medium', 'Hard', 'Diabolical'] as const;

const MenuButton = () => {
  const theme = useMantineTheme();
  const { toggleColorScheme } = useMantineColorScheme();

  const { restart, startNew } = usePuzzle();

  const [primaryColor, setPrimaryColor] = usePrimaryColor();
  const [strict, setStrict] = useStrict();
  const [highlight, setHighlight] = useHighlight();
  const [difficulty, setDifficulty] = useDifficulty();

  return (
    <Menu position={'right'}>
      <Menu.Target>
        <ActionIcon size={'xl'} variant={'default'} title={'Menu'}>
          <IconMenu2 />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Puzzle</Menu.Label>
        <Menu.Item
          onClick={() => {
            if (confirm('Would you like to start a new puzzle?')) {
              startNew();
            }
          }}
          leftSection={<IconRotateClockwise2 />}
        >
          New
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            if (confirm('Would you like to restart this puzzle?')) {
              restart();
            }
          }}
          leftSection={<IconRotate />}
        >
          Restart
        </Menu.Item>
        <Menu.Label>Experience</Menu.Label>
        <Menu.Sub>
          <Menu.Sub.Target>
            <Menu.Sub.Item leftSection={<IconAntennaBars4 />}>
              Difficulty
            </Menu.Sub.Item>
          </Menu.Sub.Target>

          <Menu.Sub.Dropdown>
            {difficulties.map((d) => (
              <Menu.Item
                key={d}
                onClick={() => {
                  if (
                    confirm(`Would you like to change the difficulty to ${d}?`)
                  ) {
                    setDifficulty(d);
                    startNew();
                  }
                }}
                disabled={d === difficulty}
              >
                {d}
              </Menu.Item>
            ))}
          </Menu.Sub.Dropdown>
        </Menu.Sub>
        <Menu.Item
          onClick={() => setStrict((prev) => !prev)}
          leftSection={<IconAlertSquare color={strict ? 'red' : undefined} />}
        >
          Errors
        </Menu.Item>
        <Menu.Label>Appearance</Menu.Label>
        <Menu.Item
          onClick={() => setHighlight((prev) => !prev)}
          leftSection={
            <IconPaint
              color={highlight ? getThemeColor(primaryColor, theme) : undefined}
            />
          }
        >
          Highlight
        </Menu.Item>
        <Menu.Item
          onClick={toggleColorScheme}
          leftSection={<IconBrightnessHalf />}
        >
          Shade
        </Menu.Item>
        <Menu.Sub>
          <Menu.Sub.Target>
            <Menu.Sub.Item leftSection={<IconPalette />}>Color</Menu.Sub.Item>
          </Menu.Sub.Target>

          <Menu.Sub.Dropdown>
            {primaryColors.map((color) => (
              <Menu.Item
                key={color}
                onClick={() => setPrimaryColor(color)}
                disabled={color === primaryColor}
                leftSection={
                  <ColorSwatch
                    color={getThemeColor(color, theme)}
                    radius={'sm'}
                    size={24}
                  />
                }
              >
                {`${color[0].toUpperCase()}${color.slice(1)}`}
              </Menu.Item>
            ))}
          </Menu.Sub.Dropdown>
        </Menu.Sub>
      </Menu.Dropdown>
    </Menu>
  );
};

export function Sudoku() {
  const { height, width } = useViewportSize();

  const [selected, setSelected] = useState(0);
  const {
    current,
    original,
    solution,
    update,
    rating,
    hasCheckpoint,
    createCheckpoint,
    removeCheckpoint,
    restoreCheckpoint,
  } = usePuzzle();
  const [difficulty] = useDifficulty();
  const [strict] = useStrict();
  const { timer } = useTimer();

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
        {} as Partial<Record<number, number>>,
      ),
    [current],
  );

  useEffect(() => {
    const controller = new AbortController();

    // TODO improve performance
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.key.startsWith('Arrow')) {
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
  }, []);

  const tall = height > width;

  return (
    <Flex
      direction={tall ? 'column' : 'row'}
      gap={'xs'}
      align={'center'}
      p={'xs'}
    >
      <AspectRatio {...(tall ? { w: '100%' } : { h: '100%' })}>
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
              onChange={(newDigit) => update(index, newDigit)}
              index={index}
              selectedIndex={solved ? index : selected}
              onClick={() => setSelected(index)}
              selectedDigit={current[selected]}
              isOriginal={Boolean(original[index] || solved)}
              wrong={Boolean(digit && solution && digit !== solution[index])}
              foundAll={digitCounts[digit] === 9}
            />
          ))}
        </SimpleGrid>
      </AspectRatio>
      <Flex
        justify={'space-between'}
        {...(tall
          ? { w: '100%', direction: 'row' }
          : { h: '100%', direction: 'column' })}
      >
        <Flex
          gap={'xs'}
          {...(tall
            ? { w: '100%', direction: 'row' }
            : { h: '100%', direction: 'column' })}
        >
          <MenuButton />
          {hasCheckpoint ? (
            <>
              <ActionIcon
                onClick={removeCheckpoint}
                size={'xl'}
                variant={'default'}
                title={'Remove Checkpoint'}
              >
                <IconClockMinus />
              </ActionIcon>
              <ActionIcon
                onClick={restoreCheckpoint}
                size={'xl'}
                variant={'default'}
                title={'Restore Checkpoint'}
              >
                <IconClockCheck />
              </ActionIcon>
            </>
          ) : (
            <ActionIcon
              onClick={createCheckpoint}
              size={'xl'}
              variant={'default'}
              title={'Create Checkpoint'}
              disabled={strict}
            >
              <IconClockPlus />
            </ActionIcon>
          )}
        </Flex>
        <Stack gap={0}>
          <Text fw={'bold'} textWrap={'nowrap'}>
            {difficulty} ({rating})
          </Text>
          <Text>{timer}</Text>
        </Stack>
      </Flex>
    </Flex>
  );
}
