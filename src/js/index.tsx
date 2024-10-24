/**
 * import: preact
 */
import { render } from "preact";
import * as React from "preact/compat";
import { useState, useEffect, useMemo, useRef } from "preact/hooks";
import { Router } from "preact-router";

/**
 * import: components
 */
import { SurahRedirect } from "~/components/SurahRedirect";
import { SurahIndex } from "~/components/SurahIndex";
import { SurahStream } from "~/components/SurahStream";
import { RandomSurah } from "~/components/RandomSurah";

/**
 * import: libs
 */
import { Quran } from "@0x1eef/quran";
import { T } from "~/lib/t";
import classNames from "classnames";
import "core-js";

/**
 * globals: window
 */
const globals = {
  Quran,
  React,
  render,
  useState,
  useEffect,
  useMemo,
  useRef,
  classNames,
};
Object.assign(window, globals);

/**
 * app: routes
 */
const App = (function () {
  const t = T(require("@json/t.json"));
  return () => {
    return (
      <Router>
        <SurahRedirect path="/" />
        <SurahIndex path="/:localeId" t={t} />
        <SurahStream path="/:localeId/:surahId" t={t} />
        <RandomSurah path="/:localeId/random" />
      </Router>
    );
  };
})();
render(<App />, document.querySelector(".mount"));
