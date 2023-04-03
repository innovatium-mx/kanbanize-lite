import 'react-i18next';
import {resources, defaultEN} from './src/i18next';

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
    interface CustomTypeOptions {
      defaultEN: typeof defaultEN;
      resources: typeof resources['en'];
    };
  };
