// cspell:ignore Supabase Ataxx Mcts
﻿import * as primitivesJs from "../../components/primitives";
import * as codePanelJs from "../../components/code-panel";
import * as terminalPanelJs from "../../components/terminal-panel";
import * as browserMockJs from "../../components/browser-mock";
import * as formMockJs from "../../components/form-mock";
import * as domTreeJs from "../../components/dom-tree";
import * as frontendPanelsJs from "../../components/frontend-panels";
import * as foundationPanelsJs from "../../components/foundation-panels";
import * as securityPanelsJs from "../../components/security-panels";
import * as appPanelsJs from "../../components/app-panels";
import * as agenticPanelsJs from "../../components/agentic-panels";
import * as asyncPanelsJs from "../../components/async-panels";
import * as backendPanelsJs from "../../components/backend-panels";
import * as gameAiPanelsJs from "../../components/game-ai-panels";
import * as vcmLockupJs from "../../components/vcm-lockup";
import type {
  EventLoopDiagramOptions,
  SyntaxCompareOptions,
  AccessibilityChecklistPanelOptions,
  AgenticFlowOptions,
  ActorLaneOptions,
  AuditScorePanelOptions,
  DelegationSplitOptions,
  DebugEvidenceBoardOptions,
  AuthFlowOptions,
  BreakpointDecisionPanelOptions,
  BrowserMockOptions,
  BoxModelDiagramOptions,
  CascadeInspectorOptions,
  CardOptions,
  ComponentConsistencyPanelOptions,
  ComponentVariantBoardOptions,
  AuditEvidenceBoardOptions,
  EvaluationRubricPanelOptions,
  EventReactionPanelOptions,
  EntityRelationshipBlueprintOptions,
  ScoreBoostsAndPenaltiesOptions,
  ProjectWorkflowPanelOptions,
  PromptQualityCompareOptions,
  SpreadsheetProblemPanelOptions,
  StaticVsInteractiveCompareOptions,
  DataTypesBoardOptions,
  ControlFlowPanelOptions,
  NormalizationStepperOptions,
  SqlBridgePanelOptions,
  SeoSnippetPreviewOptions,
  ChecklistGridOptions,
  CenterStatementOptions,
  ChipOptions,
  ComponentTreeOptions,
  CodeAnnotationOptions,
  CodePanelOptions,
  CssRuleStackOptions,
  DomTreePanelOptions,
  DomMutationFlowOptions,
  ExposureCompareOptions,
  FormMockOptions,
  FlexGridLayoutOptions,
  FrameworkDecisionMatrixOptions,
  HeaderOptions,
  JsonPanelOptions,
  IssuePriorityMatrixOptions,
  LighthouseAuditCardOptions,
  NetworkLoadBoardOptions,
  MarkBoxOptions,
  MythRealityGridOptions,
  MiniCardOptions,
  PillOptions,
  PerformanceMetricsBoardOptions,
  PptxLike,
  QualityDimensionsPanelOptions,
  RequestResponseFlowOptions,
  ResponsiveReflowPanelOptions,
  ResponsiveViewportCompareOptions,
  ShapeCatalog,
  SlideLike,
  SlideNumberOptions,
  SpecWorkflowOptions,
  SpecificityScaleOptions,
  StageChainOptions,
  TerminalPanelOptions,
  TokenBoardOptions,
  UrlBreakdownOptions,
  ServerCycleOptions,
  RestResourceOptions,
  LayerStackOptions,
  TableSchemaOptions,
  JoinSetDiagramOptions,
  ErRelationshipOptions,
  SupabaseProjectSetupPanelOptions,
  SupabaseTableEditorPanelOptions,
  AgentOrchestrationDiagramOptions,
  McpBridgePanelOptions,
  ToolExecutionConsoleOptions,
  ValidationLayerRadarOptions,
  AgentReasoningLoopOptions,
  AtaxxBoardStateOptions,
  MoveAnatomyPanelOptions,
  MctsSearchPanelOptions,
  PolicyValueArchitectureOptions,
  SelfPlayLoopPanelOptions,
  ModelGenerationTableOptions,
  TournamentRulesPanelOptions,
  IntelTimelinePanelOptions,
  DecisionPipelinePanelOptions,
  PowerNetworkMapOptions,
  VcmLockupOptions,
} from "../types";

type PrimitiveExports = {
  setBackground: (slide: SlideLike, color?: string) => void;
  addTopRule: (slide: SlideLike, SH: ShapeCatalog, color?: string) => void;
  addSlideNumber: (slide: SlideLike, pptx: PptxLike, opts?: SlideNumberOptions) => void;
  addMarkBox: (slide: SlideLike, SH: ShapeCatalog, logoMarkPath?: string, opts?: MarkBoxOptions) => void;
  addChip: (slide: SlideLike, SH: ShapeCatalog, text: string, opts?: ChipOptions) => void;
  addPill: (slide: SlideLike, SH: ShapeCatalog, text: string, opts?: PillOptions) => void;
  addCard: (slide: SlideLike, SH: ShapeCatalog, opts: CardOptions) => void;
  addMiniCard: (slide: SlideLike, SH: ShapeCatalog, opts: MiniCardOptions) => void;
  addCenterStatement: (
    slide: SlideLike,
    SH: ShapeCatalog,
    text: string,
    opts: CenterStatementOptions
  ) => void;
  addHeader: (
    slide: SlideLike,
    SH: ShapeCatalog,
    pptx: PptxLike,
    title: string,
    subtitle?: string,
    blockLabel?: string,
    opts?: HeaderOptions
  ) => void;
};

type CodePanelExports = {
  addCodePanel: (slide: SlideLike, SH: ShapeCatalog, opts: CodePanelOptions) => void;
  addCodeAnnotation: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: CodeAnnotationOptions
  ) => void;
};

type TerminalExports = {
  addTerminalPanel: (slide: SlideLike, SH: ShapeCatalog, opts: TerminalPanelOptions) => void;
};

type BrowserExports = {
  addBrowserMock: (slide: SlideLike, SH: ShapeCatalog, opts: BrowserMockOptions) => void;
};

type FormExports = {
  addFormMock: (slide: SlideLike, SH: ShapeCatalog, opts: FormMockOptions) => void;
};

type DomTreeExports = {
  addDomTreePanel: (slide: SlideLike, SH: ShapeCatalog, opts: DomTreePanelOptions) => void;
};

type FrontendPanelExports = {
  addResponsiveViewportCompare: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ResponsiveViewportCompareOptions
  ) => void;
  addResponsiveReflowPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ResponsiveReflowPanelOptions
  ) => void;
  addBreakpointDecisionPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: BreakpointDecisionPanelOptions
  ) => void;
  addComponentVariantBoard: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ComponentVariantBoardOptions
  ) => void;
  addQualityDimensionsPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: QualityDimensionsPanelOptions
  ) => void;
  addAuditEvidenceBoard: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: AuditEvidenceBoardOptions
  ) => void;
  addSeoSnippetPreview: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: SeoSnippetPreviewOptions
  ) => void;
  addComponentConsistencyPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ComponentConsistencyPanelOptions
  ) => void;
  addCssRuleStack: (slide: SlideLike, SH: ShapeCatalog, opts: CssRuleStackOptions) => void;
  addCascadeInspector: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: CascadeInspectorOptions
  ) => void;
  addSpecificityScale: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: SpecificityScaleOptions
  ) => void;
  addTokenBoard: (slide: SlideLike, SH: ShapeCatalog, opts: TokenBoardOptions) => void;
  addFrameworkDecisionMatrix: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: FrameworkDecisionMatrixOptions
  ) => void;
  addBoxModelDiagram: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: BoxModelDiagramOptions
  ) => void;
  addFlexGridLayout: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: FlexGridLayoutOptions
  ) => void;
  addLighthouseAuditCard: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: LighthouseAuditCardOptions
  ) => void;
  addPerformanceMetricsBoard: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: PerformanceMetricsBoardOptions
  ) => void;
  addNetworkLoadBoard: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: NetworkLoadBoardOptions
  ) => void;
  addAuditScorePanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: AuditScorePanelOptions
  ) => void;
  addAccessibilityChecklistPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: AccessibilityChecklistPanelOptions
  ) => void;
  addIssuePriorityMatrix: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: IssuePriorityMatrixOptions
  ) => void;
  addEvaluationRubricPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: EvaluationRubricPanelOptions
  ) => void;
  addScoreBoostsAndPenalties: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ScoreBoostsAndPenaltiesOptions
  ) => void;
  addProjectWorkflowPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ProjectWorkflowPanelOptions
  ) => void;
  addPromptQualityCompare: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: PromptQualityCompareOptions
  ) => void;
  addSpreadsheetProblemPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: SpreadsheetProblemPanelOptions
  ) => void;
  addEntityRelationshipBlueprint: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: EntityRelationshipBlueprintOptions
  ) => void;
  addNormalizationStepper: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: NormalizationStepperOptions
  ) => void;
  addSqlBridgePanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: SqlBridgePanelOptions
  ) => void;
  addStaticVsInteractiveCompare: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: StaticVsInteractiveCompareOptions
  ) => void;
  addDataTypesBoard: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: DataTypesBoardOptions
  ) => void;
  addControlFlowPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ControlFlowPanelOptions
  ) => void;
  addEventReactionPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: EventReactionPanelOptions
  ) => void;
  addDomMutationFlow: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: DomMutationFlowOptions
  ) => void;
  addDebugEvidenceBoard: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: DebugEvidenceBoardOptions
  ) => void;
};

type FoundationPanelExports = {
  addUrlBreakdown: (slide: SlideLike, SH: ShapeCatalog, opts: UrlBreakdownOptions) => void;
  addMythRealityGrid: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: MythRealityGridOptions
  ) => void;
  addActorLane: (slide: SlideLike, SH: ShapeCatalog, opts: ActorLaneOptions) => void;
  addStageChain: (slide: SlideLike, SH: ShapeCatalog, opts: StageChainOptions) => void;
  addIntelTimelinePanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: IntelTimelinePanelOptions
  ) => void;
  addDecisionPipelinePanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: DecisionPipelinePanelOptions
  ) => void;
  addPowerNetworkMap: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: PowerNetworkMapOptions
  ) => void;
};

type SecurityPanelExports = {
  addExposureCompare: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ExposureCompareOptions
  ) => void;
  addChecklistGrid: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ChecklistGridOptions
  ) => void;
  addAuthFlow: (slide: SlideLike, SH: ShapeCatalog, opts: AuthFlowOptions) => void;
};

type AppPanelExports = {
  addJsonPanel: (slide: SlideLike, SH: ShapeCatalog, opts: JsonPanelOptions) => void;
  addRequestResponseFlow: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: RequestResponseFlowOptions
  ) => void;
  addComponentTree: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ComponentTreeOptions
  ) => void;
};

type AgenticPanelExports = {
  addAgenticFlow: (slide: SlideLike, SH: ShapeCatalog, opts: AgenticFlowOptions) => void;
  addSpecWorkflow: (slide: SlideLike, SH: ShapeCatalog, opts: SpecWorkflowOptions) => void;
  addDelegationSplit: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: DelegationSplitOptions
  ) => void;
  addAgentOrchestrationDiagram: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: AgentOrchestrationDiagramOptions
  ) => void;
  addMcpBridgePanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: McpBridgePanelOptions
  ) => void;
  addToolExecutionConsole: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ToolExecutionConsoleOptions
  ) => void;
  addValidationLayerRadar: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ValidationLayerRadarOptions
  ) => void;
  addAgentReasoningLoop: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: AgentReasoningLoopOptions
  ) => void;
};

type AsyncPanelExports = {
  addEventLoopDiagram: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: EventLoopDiagramOptions
  ) => void;
  addSyntaxCompare: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: SyntaxCompareOptions
  ) => void;
};

type BackendPanelExports = {
  addServerCycle: (slide: SlideLike, SH: ShapeCatalog, opts: ServerCycleOptions) => void;
  addRestResource: (slide: SlideLike, SH: ShapeCatalog, opts: RestResourceOptions) => void;
  addLayerStack: (slide: SlideLike, SH: ShapeCatalog, opts: LayerStackOptions) => void;
  addTableSchema: (slide: SlideLike, SH: ShapeCatalog, opts: TableSchemaOptions) => void;
  addJoinSetDiagram: (slide: SlideLike, SH: ShapeCatalog, opts: JoinSetDiagramOptions) => void;
  addErRelationship: (slide: SlideLike, SH: ShapeCatalog, opts: ErRelationshipOptions) => void;
  addSupabaseProjectSetupPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: SupabaseProjectSetupPanelOptions
  ) => void;
  addSupabaseTableEditorPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: SupabaseTableEditorPanelOptions
  ) => void;
};

type GameAiPanelExports = {
  addAtaxxBoardState: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: AtaxxBoardStateOptions
  ) => void;
  addMoveAnatomyPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: MoveAnatomyPanelOptions
  ) => void;
  addMctsSearchPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: MctsSearchPanelOptions
  ) => void;
  addPolicyValueArchitecture: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: PolicyValueArchitectureOptions
  ) => void;
  addSelfPlayLoopPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: SelfPlayLoopPanelOptions
  ) => void;
  addModelGenerationTable: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: ModelGenerationTableOptions
  ) => void;
  addTournamentRulesPanel: (
    slide: SlideLike,
    SH: ShapeCatalog,
    opts: TournamentRulesPanelOptions
  ) => void;
};

const primitives = primitivesJs as unknown as PrimitiveExports;
const codePanel = codePanelJs as unknown as CodePanelExports;
const terminalPanel = terminalPanelJs as unknown as TerminalExports;
const browserMock = browserMockJs as unknown as BrowserExports;
const formMock = formMockJs as unknown as FormExports;
const domTree = domTreeJs as unknown as DomTreeExports;
const frontendPanels = frontendPanelsJs as unknown as FrontendPanelExports;
const foundationPanels = foundationPanelsJs as unknown as FoundationPanelExports;
const securityPanels = securityPanelsJs as unknown as SecurityPanelExports;
const appPanels = appPanelsJs as unknown as AppPanelExports;
const agenticPanels = agenticPanelsJs as unknown as AgenticPanelExports;
const asyncPanels = asyncPanelsJs as unknown as AsyncPanelExports;
const backendPanels = backendPanelsJs as unknown as BackendPanelExports;
const gameAiPanels = gameAiPanelsJs as unknown as GameAiPanelExports;

type VcmLockupExports = {
  vcmLockup: (slide: SlideLike, opts?: VcmLockupOptions) => void;
};
const vcmLockupMod = vcmLockupJs as unknown as VcmLockupExports;

export const setBackground = primitives.setBackground;
export const addTopRule = primitives.addTopRule;
export const addSlideNumber = primitives.addSlideNumber;
export const addMarkBox = primitives.addMarkBox;
export const addChip = primitives.addChip;
export const addPill = primitives.addPill;
export const addCard = primitives.addCard;
export const addMiniCard = primitives.addMiniCard;
export const addCenterStatement = primitives.addCenterStatement;
export const addHeader = primitives.addHeader;

export const addCodePanel = codePanel.addCodePanel;
export const addCodeAnnotation = codePanel.addCodeAnnotation;

export const addTerminalPanel = terminalPanel.addTerminalPanel;
export const addBrowserMock = browserMock.addBrowserMock;
export const addFormMock = formMock.addFormMock;
export const addDomTreePanel = domTree.addDomTreePanel;
export const addResponsiveViewportCompare = frontendPanels.addResponsiveViewportCompare;
export const addResponsiveReflowPanel = frontendPanels.addResponsiveReflowPanel;
export const addBreakpointDecisionPanel = frontendPanels.addBreakpointDecisionPanel;
export const addComponentVariantBoard = frontendPanels.addComponentVariantBoard;
export const addQualityDimensionsPanel = frontendPanels.addQualityDimensionsPanel;
export const addAuditEvidenceBoard = frontendPanels.addAuditEvidenceBoard;
export const addSeoSnippetPreview = frontendPanels.addSeoSnippetPreview;
export const addComponentConsistencyPanel = frontendPanels.addComponentConsistencyPanel;
export const addCssRuleStack = frontendPanels.addCssRuleStack;
export const addCascadeInspector = frontendPanels.addCascadeInspector;
export const addSpecificityScale = frontendPanels.addSpecificityScale;
export const addTokenBoard = frontendPanels.addTokenBoard;
export const addFrameworkDecisionMatrix = frontendPanels.addFrameworkDecisionMatrix;
export const addBoxModelDiagram = frontendPanels.addBoxModelDiagram;
export const addFlexGridLayout = frontendPanels.addFlexGridLayout;
export const addLighthouseAuditCard = frontendPanels.addLighthouseAuditCard;
export const addPerformanceMetricsBoard = frontendPanels.addPerformanceMetricsBoard;
export const addNetworkLoadBoard = frontendPanels.addNetworkLoadBoard;
export const addAuditScorePanel = frontendPanels.addAuditScorePanel;
export const addAccessibilityChecklistPanel = frontendPanels.addAccessibilityChecklistPanel;
export const addIssuePriorityMatrix = frontendPanels.addIssuePriorityMatrix;
export const addEvaluationRubricPanel = frontendPanels.addEvaluationRubricPanel;
export const addScoreBoostsAndPenalties = frontendPanels.addScoreBoostsAndPenalties;
export const addProjectWorkflowPanel = frontendPanels.addProjectWorkflowPanel;
export const addPromptQualityCompare = frontendPanels.addPromptQualityCompare;
export const addSpreadsheetProblemPanel = frontendPanels.addSpreadsheetProblemPanel;
export const addEntityRelationshipBlueprint = frontendPanels.addEntityRelationshipBlueprint;
export const addNormalizationStepper = frontendPanels.addNormalizationStepper;
export const addSqlBridgePanel = frontendPanels.addSqlBridgePanel;
export const addStaticVsInteractiveCompare = frontendPanels.addStaticVsInteractiveCompare;
export const addDataTypesBoard = frontendPanels.addDataTypesBoard;
export const addControlFlowPanel = frontendPanels.addControlFlowPanel;
export const addEventReactionPanel = frontendPanels.addEventReactionPanel;
export const addDomMutationFlow = frontendPanels.addDomMutationFlow;
export const addDebugEvidenceBoard = frontendPanels.addDebugEvidenceBoard;
export const addUrlBreakdown = foundationPanels.addUrlBreakdown;
export const addMythRealityGrid = foundationPanels.addMythRealityGrid;
export const addActorLane = foundationPanels.addActorLane;
export const addStageChain = foundationPanels.addStageChain;
export const addIntelTimelinePanel = foundationPanels.addIntelTimelinePanel;
export const addDecisionPipelinePanel = foundationPanels.addDecisionPipelinePanel;
export const addPowerNetworkMap = foundationPanels.addPowerNetworkMap;
export const addExposureCompare = securityPanels.addExposureCompare;
export const addChecklistGrid = securityPanels.addChecklistGrid;
export const addAuthFlow = securityPanels.addAuthFlow;
export const addJsonPanel = appPanels.addJsonPanel;
export const addRequestResponseFlow = appPanels.addRequestResponseFlow;
export const addComponentTree = appPanels.addComponentTree;
export const addAgenticFlow = agenticPanels.addAgenticFlow;
export const addSpecWorkflow = agenticPanels.addSpecWorkflow;
export const addDelegationSplit = agenticPanels.addDelegationSplit;
export const addAgentOrchestrationDiagram = agenticPanels.addAgentOrchestrationDiagram;
export const addMcpBridgePanel = agenticPanels.addMcpBridgePanel;
export const addToolExecutionConsole = agenticPanels.addToolExecutionConsole;
export const addValidationLayerRadar = agenticPanels.addValidationLayerRadar;
export const addAgentReasoningLoop = agenticPanels.addAgentReasoningLoop;
export const addEventLoopDiagram = asyncPanels.addEventLoopDiagram;
export const addSyntaxCompare = asyncPanels.addSyntaxCompare;

export const addServerCycle = backendPanels.addServerCycle;
export const addRestResource = backendPanels.addRestResource;
export const addLayerStack = backendPanels.addLayerStack;
export const addTableSchema = backendPanels.addTableSchema;
export const addJoinSetDiagram = backendPanels.addJoinSetDiagram;
export const addErRelationship = backendPanels.addErRelationship;
export const addSupabaseProjectSetupPanel = backendPanels.addSupabaseProjectSetupPanel;
export const addSupabaseTableEditorPanel = backendPanels.addSupabaseTableEditorPanel;
export const addAtaxxBoardState = gameAiPanels.addAtaxxBoardState;
export const addMoveAnatomyPanel = gameAiPanels.addMoveAnatomyPanel;
export const addMctsSearchPanel = gameAiPanels.addMctsSearchPanel;
export const addPolicyValueArchitecture = gameAiPanels.addPolicyValueArchitecture;
export const addSelfPlayLoopPanel = gameAiPanels.addSelfPlayLoopPanel;
export const addModelGenerationTable = gameAiPanels.addModelGenerationTable;
export const addTournamentRulesPanel = gameAiPanels.addTournamentRulesPanel;

export const vcmLockup = vcmLockupMod.vcmLockup;

