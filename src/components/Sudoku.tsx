import {
  ActionIcon,
  AspectRatio,
  darken,
  em,
  Flex,
  Input,
  Menu,
  SimpleGrid,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import {
  IconBrightnessHalf,
  IconMenu2,
  IconRainbow,
  IconRefreshAlert,
  IconRotate,
  IconRotateClockwise2,
} from '@tabler/icons-react';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { usePuzzle } from '#/hooks/usePuzzle';
import { useStrict } from '#/hooks/useStrict';
import { getIndices } from '#/utils/getIndices';
import { PickPrimaryColorModal } from './PickPrimaryColorModal';

function Cell({
  digit,
  onChange,
  index,
  selectedIndex,
  onClick,
  selectedDigit,
  isOriginal,
  wrong,
}: {
  digit: number;
  onChange: (newDigit: number) => void;
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
      readOnly={isOriginal}
      value={digit || ''}
      onChange={(e) => {
        const newNumber = Number(
          e.currentTarget.value
            .toString()
            .replace('.', '')
            .replace(',', '')
            .replace(digit.toString(), ''),
        );
        if (!Number.isNaN(newNumber)) {
          onChange(newNumber);
        }
      }}
      step={1}
      min={0}
      max={9}
      onKeyDownCapture={(e) => {
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
          fontSize: `${md ? 32 : sm ? 24 : xs ? 16 : 12}px`,
          textAlign: 'center',
          fontWeight: isOriginal ? 'bold' : undefined,
          color: strict && wrong ? 'red' : undefined,
          userSelect: 'none',
          minHeight: 0,
        },
      }}
    />
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

  useEffect(() => {
    const controller = new AbortController();

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
    <>
      <PickPrimaryColorModal
        opened={showColorPicker}
        onClose={toggleColorPicker}
      />
      <Flex
        style={{ flexDirection: tall ? 'column' : 'row' }}
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
                isOriginal={!!original[index]}
                wrong={!!digit && !!solution && digit !== solution[index]}
              />
            ))}
          </SimpleGrid>
        </AspectRatio>
        <MenuButton toggleColorPicker={toggleColorPicker} />
      </Flex>
    </>
  );
}
