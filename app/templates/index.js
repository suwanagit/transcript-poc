import DefaultTranscript from './DefaultTranscript';
import PortraitByYear from './PortraitByYear';
import PortraitBySubject from './PortraitBySubject';
import LandscapeByYear from './LandscapeByYear';
import LandscapeBySubject from './LandscapeBySubject';

export const TEMPLATES = {
  default: {
    name: 'Default',
    description: 'Standard portrait layout',
    component: DefaultTranscript,
  },
  portraitByYear: {
    name: 'Portrait by Year',
    description: 'Courses grouped by academic year',
    component: PortraitByYear,
  },
  portraitBySubject: {
    name: 'Portrait by Subject',
    description: 'Courses grouped by subject',
    component: PortraitBySubject,
  },
  landscapeByYear: {
    name: 'Landscape by Year',
    description: 'Landscape layout grouped by year',
    component: LandscapeByYear,
  },
  landscapeBySubject: {
    name: 'Landscape by Subject',
    description: 'Landscape layout grouped by subject',
    component: LandscapeBySubject,
  },
};

export default TEMPLATES;