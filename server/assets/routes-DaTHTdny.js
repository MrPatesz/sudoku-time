import { useCallback, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ActionIcon, AspectRatio, Group, Menu, SimpleGrid, Stack, Text, UnstyledButton, darken, useComputedColorScheme, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconBrightnessHalf, IconMenu2, IconRotate, IconRotateClockwise2 } from "@tabler/icons-react/dist/esm/icons/index.mjs";
import { useLocalStorage } from "@uidotdev/usehooks";
//#region src/hooks/usePuzzle.tsx
var usePuzzle = () => {
	const [puzzle, setPuzzle] = useLocalStorage("puzzle");
	useEffect(() => {
		if (!puzzle) (async () => {
			const puzzles = (await import("./puzzles-BE1pP8Ps.js")).default;
			const original = puzzles[Math.floor(Math.random() * puzzles.length)].split("").map(Number);
			setPuzzle({
				original,
				current: original
			});
		})();
	}, [puzzle, setPuzzle]);
	const update = useCallback((index, digit) => setPuzzle((prev) => prev && (!prev.original[index] ? {
		...prev,
		current: prev.current.toSpliced(index, 1, digit)
	} : prev)), [setPuzzle]);
	const restart = useCallback(() => setPuzzle((prev) => prev && {
		...prev,
		current: prev.original
	}), [setPuzzle]);
	const startNew = useCallback(() => setPuzzle(void 0), [setPuzzle]);
	return {
		current: puzzle?.current ?? [],
		original: puzzle?.original ?? [],
		update,
		restart,
		startNew
	};
};
//#endregion
//#region src/utils/getIndices.ts
var getIndices = (index) => {
	const rowIndex = Math.floor(index / 9);
	const colIndex = index % 9;
	return {
		rowIndex,
		colIndex,
		boxIndex: Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3)
	};
};
//#endregion
//#region src/components/Sudoku.tsx
function Cell({ digit, index, selectedIndex, onClick, selectedDigit }) {
	const { rowIndex: selectedRowIndex, colIndex: selectedColIndex, boxIndex: selectedBoxIndex } = getIndices(selectedIndex);
	const { colIndex, rowIndex, boxIndex } = getIndices(index);
	const selectedIndirectly = rowIndex === selectedRowIndex || colIndex === selectedColIndex || boxIndex === selectedBoxIndex;
	const theme = useMantineTheme();
	const scheme = useComputedColorScheme();
	const bg = (() => {
		const delta = scheme === "light" ? 0 : 1;
		if (index === selectedIndex) return theme.colors[theme.primaryColor]?.[3 + delta];
		else if (selectedDigit && selectedDigit === digit) return theme.colors[theme.primaryColor]?.[2 + delta];
		else if (selectedIndirectly) return theme.colors[theme.primaryColor]?.[1 + delta];
	})();
	return /* @__PURE__ */ jsx(UnstyledButton, {
		onClick,
		style: {
			border: "1px solid grey",
			borderLeft: colIndex % 3 || !colIndex ? void 0 : "4px solid grey",
			borderTop: rowIndex % 3 || !rowIndex ? void 0 : "4px solid grey"
		},
		bg: scheme === "dark" ? bg && darken(bg, .5) : bg,
		p: 0,
		children: /* @__PURE__ */ jsx(Text, {
			size: "32px",
			ta: "center",
			children: digit || null
		})
	});
}
function Sudoku() {
	const { toggleColorScheme } = useMantineColorScheme();
	const [selected, setSelected] = useState(0);
	const { current, original, restart, startNew, update } = usePuzzle();
	const selectedDigit = current[selected];
	const solved = current.every((digit) => digit);
	const digitCounts = current.reduce((acc, digit) => {
		acc[digit] = (acc[digit] ?? 0) + 1;
		return acc;
	}, {});
	useEffect(() => {
		const controller = new AbortController();
		window.addEventListener("keydown", (e) => {
			const digit = Number(e.key);
			if (!Number.isNaN(digit)) update(selected, digit);
		}, controller);
		return () => controller.abort();
	}, [selected, update]);
	return /* @__PURE__ */ jsxs(Stack, { children: [/* @__PURE__ */ jsx(AspectRatio, {
		maw: 600,
		children: /* @__PURE__ */ jsx(SimpleGrid, {
			cols: 9,
			spacing: 0,
			verticalSpacing: 0,
			bd: "4px solid grey",
			children: current.map((digit, index) => /* @__PURE__ */ jsx(Cell, {
				digit,
				index,
				selectedIndex: solved ? index : selected,
				onClick: () => setSelected(index),
				selectedDigit
			}, index))
		})
	}), /* @__PURE__ */ jsxs(Group, {
		gap: "xs",
		children: [Array.from({ length: 10 }).map((_, digit) => /* @__PURE__ */ jsx(ActionIcon, {
			size: "xl",
			variant: "default",
			onClick: () => update(selected, digit),
			disabled: Boolean(original[selected]) || digitCounts[digit] === 9 || solved,
			children: digit
		}, digit)), /* @__PURE__ */ jsxs(Menu, { children: [/* @__PURE__ */ jsx(Menu.Target, { children: /* @__PURE__ */ jsx(ActionIcon, {
			size: "xl",
			variant: "default",
			children: /* @__PURE__ */ jsx(IconMenu2, {})
		}) }), /* @__PURE__ */ jsxs(Menu.Dropdown, { children: [
			/* @__PURE__ */ jsx(Menu.Item, {
				onClick: () => {
					if (confirm("Are you sure you want to restart?")) restart();
				},
				leftSection: /* @__PURE__ */ jsx(IconRotate, {}),
				children: "Restart"
			}),
			/* @__PURE__ */ jsx(Menu.Item, {
				onClick: () => {
					if (confirm("Are you sure you want to start the next puzzle?")) startNew();
				},
				leftSection: /* @__PURE__ */ jsx(IconRotateClockwise2, {}),
				children: "New"
			}),
			/* @__PURE__ */ jsx(Menu.Item, {
				onClick: toggleColorScheme,
				leftSection: /* @__PURE__ */ jsx(IconBrightnessHalf, {}),
				children: "Colors"
			})
		] })] })]
	})] });
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Home() {
	return /* @__PURE__ */ jsx(Sudoku, {});
}
//#endregion
export { Home as component };
