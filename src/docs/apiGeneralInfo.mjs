import { loadJSON } from '../common/loadJSON.mjs';

const { version } = loadJSON('../../package.json')

export const openapi = '3.0.3';
export const info = {
  title: 'Simple shop backend API',
  version,
  description: 'This is a REST API application made with Express.',
};
