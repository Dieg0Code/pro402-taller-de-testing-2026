const theme = require("./theme");
const primitives = require("./components/primitives");
const codePanel = require("./components/code-panel");
const terminalPanel = require("./components/terminal-panel");
const browserMock = require("./components/browser-mock");
const formMock = require("./components/form-mock");
const domTree = require("./components/dom-tree");
const frontendPanels = require("./components/frontend-panels");
const foundationPanels = require("./components/foundation-panels");
const securityPanels = require("./components/security-panels");
const appPanels = require("./components/app-panels");
const agenticPanels = require("./components/agentic-panels");
const asyncPanels = require("./components/async-panels");
const backendPanels = require("./components/backend-panels");
const aiPanels = require("./components/ai-panels");
const productAiPanels = require("./components/product-ai-panels");
const gameAiPanels = require("./components/game-ai-panels");
const vcmLockup = require("./components/vcm-lockup");
const utils = require("./utils");
const components = {
  ...primitives,
  ...codePanel,
  ...terminalPanel,
  ...browserMock,
  ...formMock,
  ...domTree,
  ...frontendPanels,
  ...foundationPanels,
  ...securityPanels,
  ...appPanels,
  ...agenticPanels,
  ...asyncPanels,
  ...backendPanels,
  ...aiPanels,
  ...productAiPanels,
  ...gameAiPanels,
  ...vcmLockup,
};

module.exports = {
  theme,
  components,
  primitives,
  codePanel,
  terminalPanel,
  browserMock,
  formMock,
  domTree,
  frontendPanels,
  foundationPanels,
  securityPanels,
  appPanels,
  agenticPanels,
  asyncPanels,
  backendPanels,
  aiPanels,
  productAiPanels,
  gameAiPanels,
  vcmLockup,
  utils,
};
