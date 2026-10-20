/**
 * Library Bus Website Design data (chapter 03): grid system and the 20-screen set.
 */
import { LIBRARY_BUS_20_SCREENS } from './screens';

export const WEBSITE_DESIGN_DATA = {
  chapter: '3',
  subChapter: '3.1, 3.2, 3.3',
  titleVi: 'THIẾT KẾ WEBSITE',
  titleEn: 'WEBSITE DESIGN',
  subtitleVi: '/Hệ thống lưới, wireframe và thiết kế trực quan/',
  subtitleEn: '/Grid system, wireframe and visual design/',
  gridSystem: {
    type: 'Desktop',
    count: 12,
    mobileVi: 'Mobile dùng bố cục một cột, các khối xếp dọc.',
    mobileEn: 'Mobile uses a single-column layout with blocks stacked vertically.'
  },
  masterBoards: {
    wireframeAllSrc: '/library-bus/library_bus_wireframe_all_screens.webp',
    uiDesignAllSrc: '/library-bus/library_bus_ui_design_all_screens.webp',
    referenceTemplateSrc: '/library-bus/reference_wireframe_vs_ui.webp',
    screenCount: 20
  },
  screens: LIBRARY_BUS_20_SCREENS
};
