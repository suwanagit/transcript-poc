/**
 * Template Registry
 * Metadata for all templates - functions are defined in page.js
 * This allows easy template selection without needing React components
 */

export const TEMPLATES = {
  default: {
    name: 'Default',
    description: 'Professional portrait layout',
    orientation: 'portrait',
  },
  portraitByYear: {
    name: 'Portrait by Year',
    description: 'Courses grouped by academic term',
    orientation: 'portrait',
  },
  portraitBySubject: {
    name: 'Portrait by Subject',
    description: 'Courses grouped by subject',
    orientation: 'portrait',
  },
  landscapeByYear: {
    name: 'Landscape by Year',
    description: 'Landscape layout grouped by term',
    orientation: 'landscape',
  },
  landscapeBySubject: {
    name: 'Landscape by Subject',
    description: 'Landscape layout grouped by subject',
    orientation: 'landscape',
  },
};

export default TEMPLATES;