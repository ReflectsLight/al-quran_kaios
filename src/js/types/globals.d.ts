import { Quran as Q } from "@0x1eef/quran";
import * as preact from "preact";
import * as compat from "preact/compat";
import * as hooks from "preact/hooks";
import classn from "classnames";

declare global {
  const Quran: typeof Q;
  const render: typeof preact.render;
  const useState: typeof hooks.useState;
  const useEffect: typeof hooks.useEffect;
  const useRef: typeof hooks.useRef;
  const useMemo: typeof hooks.useMemo;
  const createRef: typeof preact.createRef;
  const forwardRef: typeof compat.forwardRef;
  const classNames: typeof classn;
}
