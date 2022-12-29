import * as apiGeneralInfo from './apiGeneralInfo.mjs';
import * as servers from './servers.mjs';
import * as tags from './tags.mjs';
import * as components from './components/index.mjs';
import auth from './auth/index.mjs';
import user from './user/index.mjs';

export default {
  ...apiGeneralInfo,
  ...servers,
  ...tags,
  ...components,
  paths: {
    ...auth,
    ...user,
  },
};
