import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  LIBRARY_BUS_11_SCREENS,
  LIBRARY_BUS_20_SCREENS,
  LIBRARY_BUS_MOBILE_SCREENS,
  WEBSITE_DESIGN_DATA,
} from '../app/data/libraryBusData';

describe('Library Bus 11 Core Screens Specification & Asset Integrity', () => {
  const publicDir = path.resolve(__dirname, '../public');

  it('defines exactly 11 core desktop screens and 11 mobile screens', () => {
    expect(LIBRARY_BUS_11_SCREENS).toHaveLength(11);
    expect(LIBRARY_BUS_20_SCREENS).toHaveLength(11);
    expect(LIBRARY_BUS_MOBILE_SCREENS).toHaveLength(11);
    expect(WEBSITE_DESIGN_DATA.masterBoards.screenCount).toBe(11);
  });

  it('verifies every desktop wireframe and UI screenshot exists in public/library-bus/screens/', () => {
    for (const screen of LIBRARY_BUS_11_SCREENS) {
      const wfPath = path.join(publicDir, screen.wireframeSrc);
      const uiPath = path.join(publicDir, screen.uiSrc);
      expect(fs.existsSync(wfPath), `Missing desktop wireframe: ${screen.wireframeSrc}`).toBe(true);
      expect(fs.existsSync(uiPath), `Missing desktop UI screenshot: ${screen.uiSrc}`).toBe(true);
    }
  });

  it('verifies every mobile wireframe and UI screenshot exists in public/library-bus/screens/', () => {
    for (const screen of LIBRARY_BUS_MOBILE_SCREENS) {
      const wfPath = path.join(publicDir, screen.wireframeSrc);
      const uiPath = path.join(publicDir, screen.uiSrc);
      expect(fs.existsSync(wfPath), `Missing mobile wireframe: ${screen.wireframeSrc}`).toBe(true);
      expect(fs.existsSync(uiPath), `Missing mobile UI screenshot: ${screen.uiSrc}`).toBe(true);
    }
  });
});
