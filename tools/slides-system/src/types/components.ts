// cspell:ignore Supabase Ataxx Mcts
﻿import type { Bounds } from "./slide-like";

export interface PositionedBox extends Bounds {
  [key: string]: unknown;
}

export interface ChipOptions extends Partial<PositionedBox> {
  fill?: string;
  color?: string;
  fontSize?: number;
  rectRadius?: number;
}

export interface PillOptions extends Partial<PositionedBox> {
  fill?: string;
  line?: string;
  color?: string;
  fontSize?: number;
  rectRadius?: number;
}

export interface CardOptions extends PositionedBox {
  title?: string;
  body?: string;
  fill?: string;
  line?: string;
  accent?: string;
  accentW?: number;
  titleFontSize?: number;
  titleColor?: string;
  bodyFontSize?: number;
  bodyColor?: string;
  bodyAlign?: string;
  bodyYOffset?: number;
  rectRadius?: number;
}

export interface MiniCardOptions extends PositionedBox {
  title?: string;
  body?: string;
  fill?: string;
  line?: string;
  accent?: string;
  titleFontSize?: number;
  bodyFontSize?: number;
  rectRadius?: number;
}

export interface CenterStatementOptions extends PositionedBox {
  fill?: string;
  color?: string;
  fontSize?: number;
  rectRadius?: number;
  fontFace?: string;
}

export interface ServerCycleOptions extends PositionedBox {
  [key: string]: unknown;
}

export interface RestResourceOptions extends PositionedBox {
  verb: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  json?: string;
}

export interface LayerStackOptions extends PositionedBox {
  [key: string]: unknown;
}

export interface SlideNumberOptions extends Partial<PositionedBox> {
  fontSize?: number;
  color?: string;
}

export interface MarkBoxOptions extends Partial<PositionedBox> {
  fill?: string;
  imageX?: number;
  imageY?: number;
  imageW?: number;
  imageH?: number;
}

export interface HeaderOptions {
  background?: string;
  ruleColor?: string;
  number?: SlideNumberOptions;
  classLabel?: string;
  chipW?: number;
  logoMarkPath?: string;
  mark?: MarkBoxOptions;
  titleX?: number;
  titleY?: number;
  titleW?: number;
  titleH?: number;
  titleFontSize?: number;
  subtitleX?: number;
  subtitleY?: number;
  subtitleW?: number;
  subtitleH?: number;
  subtitleFontSize?: number;
}

export interface CodePanelOptions extends PositionedBox {
  title?: string;
  code?: string;
  lang?: string;
  rectRadius?: number;
  fill?: string;
  titleFill?: string;
  fontSize?: number;
  annotations?: Omit<
    CodeAnnotationOptions,
    "codeX" | "codeY" | "codeW" | "codeH" | "textOffsetX" | "textOffsetY" | "textAreaH" | "fontSize"
  >[];
}

export interface AnnotationTarget extends PositionedBox {
  anchorY?: number;
  side?: "left" | "right";
}

export interface CodeAnnotationOptions {
  codeX: number;
  codeY: number;
  codeW: number;
  codeH: number;
  totalLines?: number;
  lineNumber?: number;
  color?: string;
  connectorColor?: string;
  textOffsetX?: number;
  textOffsetY?: number;
  textAreaH?: number;
  fontSize?: number;
  linePitch?: number;
  lineHeight?: number;
  lineDigits?: number;
  charW?: number;
  side?: "left" | "right";
  stroke?: number;
  gutterMarkerW?: number;
  gutterMarkerH?: number;
  column?: number;
  length?: number;
  markerH?: number;
  laneX?: number;
  targetMarkerW?: number;
  targetMarkerH?: number;
  target?: AnnotationTarget;
  toX?: number;
  toY?: number;
  routeY?: number;
  badgeText?: string | number;
  badgeSize?: number;
  badgeFontSize?: number;
  sourceBadgeStyle?: "circle" | "port" | "none";
  targetBadgeStyle?: "circle" | "tab" | "none";
  showTargetBadgeLabel?: boolean;
  targetBadgeW?: number;
  targetBadgeH?: number;
  targetBadgeFontSize?: number;
  sourcePortW?: number;
  sourcePortH?: number;
  showBadge?: boolean;
  showHighlight?: boolean;
  highlightFill?: string;
  highlightH?: number;
  showUnderline?: boolean;
}

export interface TerminalLine {
  prompt?: string;
  text?: string;
  kind?: string;
}

export interface TerminalPanelOptions extends PositionedBox {
  title?: string;
  lines?: TerminalLine[];
  fill?: string;
  fontSize?: number;
}

export interface BrowserMockOptions extends PositionedBox {
  url?: string;
  title?: string;
}

export interface ViewportCardDescriptor {
  label?: string;
  sizeLabel?: string;
  notes?: string[];
}

export interface FormField {
  label: string;
  multiline?: boolean;
  [key: string]: unknown;
}

export interface FormMockOptions extends PositionedBox {
  title?: string;
  fields?: FormField[];
  buttonLabel?: string;
  buttonW?: number;
}

export interface ResponsiveViewportCompareOptions extends PositionedBox {
  title?: string;
  leftW?: number;
  rightW?: number;
  gap?: number;
  left?: ViewportCardDescriptor;
  right?: ViewportCardDescriptor;
}

export interface ResponsiveReflowStage {
  label?: string;
  sizeLabel?: string;
  behavior?: string;
  layout?: "desktop" | "tablet" | "mobile";
  tone?: string;
  toneFill?: string;
  behaviorFill?: string;
}

export interface ResponsiveReflowPanelOptions extends PositionedBox {
  title?: string;
  stages?: ResponsiveReflowStage[];
  footer?: string;
}

export interface BreakpointDecisionStage {
  label?: string;
  sizeLabel?: string;
  note?: string;
  accent?: string;
  fill?: string;
  active?: boolean;
}

export interface BreakpointDecisionPanelOptions extends PositionedBox {
  title?: string;
  stages?: BreakpointDecisionStage[];
  signalTitle?: string;
  signalBody?: string;
  breakpointTitle?: string;
  breakpointBody?: string;
  focusSizeLabel?: string;
  decisionTitle?: string;
  decisionBody?: string;
  footer?: string;
}

export interface ComponentVariant {
  label?: string;
  role?: string;
  description?: string;
  accent?: string;
  fill?: string;
  preview?: "card" | "button" | "nav" | "stack";
  ctaLabel?: string;
}

export interface ComponentVariantBoardOptions extends PositionedBox {
  title?: string;
  variants?: ComponentVariant[];
  footer?: string;
}

export interface ComponentConsistencyPanelOptions extends PositionedBox {
  title?: string;
  leftTitle?: string;
  leftSubtitle?: string;
  leftBody?: string;
  leftFill?: string;
  leftAccent?: string;
  rightTitle?: string;
  rightSubtitle?: string;
  rightBody?: string;
  rightFill?: string;
  rightAccent?: string;
  footer?: string;
}

export interface QualityDimension {
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface QualityDimensionsPanelOptions extends PositionedBox {
  title?: string;
  centerLabel?: string;
  dimensions?: QualityDimension[];
  footer?: string;
}

export interface AuditEvidenceItem {
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface AuditEvidenceBoardOptions extends PositionedBox {
  title?: string;
  items?: AuditEvidenceItem[];
  insightTitle?: string;
  insightBody?: string;
  steps?: string[];
  footer?: string;
}

export interface SeoSnippetPreviewOptions extends PositionedBox {
  title?: string;
  url?: string;
  description?: string;
  breadcrumb?: string;
  titleColor?: string;
  urlColor?: string;
  descriptionColor?: string;
  borderColor?: string;
  fill?: string;
}

export interface CssRuleEntry {
  selector?: string;
  declaration?: string;
  specificity?: string;
  active?: boolean;
}

export interface CssRuleStackOptions extends PositionedBox {
  title?: string;
  rules?: CssRuleEntry[];
  footer?: string;
}

export interface CascadeInspectorRule {
  selector?: string;
  declaration?: string;
  specificity?: string;
  reason?: string;
  active?: boolean;
}

export interface CascadeInspectorOptions extends PositionedBox {
  title?: string;
  elementLabel?: string;
  propertyLabel?: string;
  propertyValue?: string;
  resultLabel?: string;
  resolvedValue?: string;
  resultNote?: string;
  rules?: CascadeInspectorRule[];
  elementW?: number;
  resultW?: number;
  gap?: number;
}

export interface SpecificityScaleEntry {
  label?: string;
  value?: string;
  weightLabel?: string;
  active?: boolean;
  scale?: number;
}

export interface SpecificityScaleOptions extends PositionedBox {
  title?: string;
  subtitle?: string;
  entries?: SpecificityScaleEntry[];
  footer?: string;
}

export interface TokenBoardItem {
  label?: string;
  value?: string;
  swatch?: string;
}

export interface TokenBoardGroup {
  title?: string;
  tone?: string;
  fill?: string;
  items?: TokenBoardItem[];
}

export interface TokenBoardOptions extends PositionedBox {
  title?: string;
  groups?: TokenBoardGroup[];
  footer?: string;
}

export interface FrameworkDecisionRow {
  label?: string;
  helps?: string;
  risk?: string;
  decision?: string;
  accent?: string;
}

export interface FrameworkDecisionMatrixOptions extends PositionedBox {
  title?: string;
  rows?: FrameworkDecisionRow[];
  footer?: string;
}

export interface UrlBreakdownSegment {
  label?: string;
  value?: string;
  note?: string;
  accent?: string;
  fill?: string;
  ratio?: number;
  mono?: boolean;
  valueFontSize?: number;
  noteFontSize?: number;
}

export interface UrlBreakdownOptions extends PositionedBox {
  title?: string;
  url?: string;
  urlFill?: string;
  urlFontSize?: number;
  headerFill?: string;
  fill?: string;
  line?: string;
  segments?: UrlBreakdownSegment[];
  footer?: string;
}

export interface MythRealityEntry {
  badge?: string;
  myth?: string;
  reality?: string;
  accent?: string;
  fill?: string;
  badgeFill?: string;
  mythFontSize?: number;
  realityFontSize?: number;
}

export interface MythRealityGridOptions extends PositionedBox {
  title?: string;
  entries?: MythRealityEntry[];
  columns?: number;
  fill?: string;
  line?: string;
  headerFill?: string;
  footer?: string;
}

export interface ActorLaneEntry {
  label?: string;
  body?: string;
  accent?: string;
  fill?: string;
  titleFontSize?: number;
  bodyFontSize?: number;
}

export interface ActorLaneOptions extends PositionedBox {
  title?: string;
  entries?: ActorLaneEntry[];
  fill?: string;
  line?: string;
  headerFill?: string;
  railYOffset?: number;
  cardW?: number;
  cardH?: number;
  footer?: string;
}

export interface StageChainStage {
  step?: string;
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
  tone?: "light" | "dark";
}

export interface StageChainNote {
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface StageChainOptions extends PositionedBox {
  title?: string;
  stages?: StageChainStage[];
  notes?: StageChainNote[];
  fill?: string;
  line?: string;
  headerFill?: string;
  chevronColor?: string;
  compact?: boolean;
  footer?: string;
}

export interface IntelTimelineItem {
  date?: string;
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface IntelTimelinePanelOptions extends PositionedBox {
  title?: string;
  items?: IntelTimelineItem[];
  fill?: string;
  line?: string;
  headerFill?: string;
  chevronColor?: string;
  footer?: string;
}

export interface DecisionPipelineStage {
  label?: string;
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface DecisionPipelinePanelOptions extends PositionedBox {
  title?: string;
  stages?: DecisionPipelineStage[];
  fill?: string;
  line?: string;
  headerFill?: string;
  chevronColor?: string;
  footer?: string;
}

export interface PowerNetworkCenter {
  title?: string;
  body?: string;
  accent?: string;
}

export interface PowerNetworkNode {
  title?: string;
  body?: string;
  accent?: string;
  position?: "lt" | "lb" | "rt" | "rb" | "bc";
}

export interface PowerNetworkMapOptions extends PositionedBox {
  title?: string;
  center?: PowerNetworkCenter;
  nodes?: PowerNetworkNode[];
  fill?: string;
  line?: string;
  headerFill?: string;
}

export interface ExposureColumn {
  label?: string;
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
  bodyFontSize?: number;
}

export interface ExposureCompareOptions extends PositionedBox {
  title?: string;
  fill?: string;
  line?: string;
  headerFill?: string;
  leftW?: number;
  bridgeW?: number;
  gap?: number;
  bridgeLabel?: string;
  bridgeAccent?: string;
  left?: ExposureColumn;
  right?: ExposureColumn;
  footer?: string;
}

export interface ChecklistGridEntry {
  badge?: string;
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
  badgeFill?: string;
  titleFontSize?: number;
  bodyFontSize?: number;
}

export interface ChecklistGridOptions extends PositionedBox {
  title?: string;
  entries?: ChecklistGridEntry[];
  columns?: number;
  fill?: string;
  line?: string;
  headerFill?: string;
  footer?: string;
}

export interface AuthFlowStep {
  step?: string;
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface AuthFlowOptions extends PositionedBox {
  title?: string;
  steps?: AuthFlowStep[];
  fill?: string;
  line?: string;
  headerFill?: string;
  chevronColor?: string;
  example?: string;
  footer?: string;
}

export interface AgenticFlowStep {
  step?: string;
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
  tone?: "light" | "dark";
}

export interface AgenticFlowOptions extends PositionedBox {
  title?: string;
  steps?: AgenticFlowStep[];
  fill?: string;
  line?: string;
  headerFill?: string;
  chevronColor?: string;
  compact?: boolean;
  footer?: string;
}

export interface SpecWorkflowPhase {
  step?: string;
  title?: string;
  question?: string;
  artifact?: string;
  control?: string;
  accent?: string;
  fill?: string;
}

export interface SpecWorkflowOptions extends PositionedBox {
  title?: string;
  phases?: SpecWorkflowPhase[];
  fill?: string;
  line?: string;
  headerFill?: string;
  compact?: boolean;
  footer?: string;
}

export interface DelegationColumn {
  title?: string;
  subtitle?: string;
  items?: string[];
  accent?: string;
  fill?: string;
  dark?: boolean;
}

export interface DelegationSplitOptions extends PositionedBox {
  title?: string;
  left?: DelegationColumn;
  right?: DelegationColumn;
  fill?: string;
  line?: string;
  headerFill?: string;
  bridgeW?: number;
  bridgeFill?: string;
  bridgeAccent?: string;
  bridgeLabel?: string;
  bridgeBody?: string;
  footer?: string;
}

export interface BoxModelDiagramOptions extends PositionedBox {
  title?: string;
  margin?: string;
  border?: string;
  padding?: string;
  content?: string;
}

export interface FlexGridLayoutOptions extends PositionedBox {
  title?: string;
  mode?: "flex" | "grid";
  itemCount?: number;
  columns?: number;
}

export interface LighthouseScore {
  label: string;
  score: number;
}

export interface LighthouseAuditCardOptions extends PositionedBox {
  title?: string;
  scores?: LighthouseScore[];
  summary?: string;
}

export interface PerformanceMetricItem {
  label?: string;
  value?: string;
  note?: string;
  accent?: string;
  fill?: string;
}

export interface PerformanceMetricsBoardOptions extends PositionedBox {
  title?: string;
  metrics?: PerformanceMetricItem[];
  footer?: string;
}

export interface NetworkResourceItem {
  label?: string;
  kind?: string;
  sizeLabel?: string;
  durationLabel?: string;
  weight?: number;
  accent?: string;
  fill?: string;
}

export interface NetworkLoadBoardOptions extends PositionedBox {
  title?: string;
  resources?: NetworkResourceItem[];
  summaryTitle?: string;
  summaryBody?: string;
  footer?: string;
}

export interface AuditScoreItem {
  label?: string;
  score?: number;
  note?: string;
}

export interface AuditScorePanelOptions extends PositionedBox {
  title?: string;
  items?: AuditScoreItem[];
  footer?: string;
}

export interface AccessibilityChecklistItem {
  label?: string;
  note?: string;
  status?: "ok" | "warn" | "critical";
}

export interface AccessibilityChecklistPanelOptions extends PositionedBox {
  title?: string;
  items?: AccessibilityChecklistItem[];
  footer?: string;
}

export interface IssuePriorityItem {
  label?: string;
  impact?: "low" | "high";
  urgency?: "low" | "high";
  accent?: string;
  fill?: string;
}

export interface IssuePriorityMatrixOptions extends PositionedBox {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  items?: IssuePriorityItem[];
  footer?: string;
}

export interface EvaluationRubricRow {
  label?: string;
  weight?: number;
  weightLabel?: string;
  note?: string;
  accent?: string;
  fill?: string;
}

export interface EvaluationRubricPanelOptions extends PositionedBox {
  title?: string;
  rows?: EvaluationRubricRow[];
  totalLabel?: string;
  footer?: string;
}

export interface ScoreBoostItem {
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface ScoreBoostsAndPenaltiesOptions extends PositionedBox {
  title?: string;
  boostsTitle?: string;
  boostsSubtitle?: string;
  boosts?: ScoreBoostItem[];
  penaltiesTitle?: string;
  penaltiesSubtitle?: string;
  penalties?: ScoreBoostItem[];
  footer?: string;
}

export interface ProjectWorkflowStage {
  step?: string;
  title?: string;
  artifact?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface ProjectWorkflowPanelOptions extends PositionedBox {
  title?: string;
  stages?: ProjectWorkflowStage[];
  footer?: string;
}

export interface PromptQualityCompareOptions extends PositionedBox {
  title?: string;
  badTitle?: string;
  badSubtitle?: string;
  badPrompt?: string;
  badNotes?: string[];
  goodTitle?: string;
  goodSubtitle?: string;
  goodPrompt?: string;
  goodNotes?: string[];
  footer?: string;
}

export interface StaticVsInteractiveCompareOptions extends PositionedBox {
  title?: string;
  leftTitle?: string;
  leftSubtitle?: string;
  leftCta?: string;
  leftNote?: string;
  leftSideLabel?: string;
  rightTitle?: string;
  rightSubtitle?: string;
  rightCta?: string;
  rightNote?: string;
  rightSideLabel?: string;
  footer?: string;
}

export interface DataTypesBoardCard {
  label?: string;
  sample?: string;
  note?: string;
  accent?: string;
  fill?: string;
}

export interface DataTypesBoardOptions extends PositionedBox {
  title?: string;
  cards?: DataTypesBoardCard[];
  footer?: string;
}

export interface ControlFlowPanelOptions extends PositionedBox {
  title?: string;
  inputTitle?: string;
  inputCode?: string;
  inputBody?: string;
  conditionTitle?: string;
  conditionLabel?: string;
  conditionBody?: string;
  outputTitle?: string;
  trueTitle?: string;
  trueBody?: string;
  falseTitle?: string;
  falseBody?: string;
  footer?: string;
}

export interface EventReactionStage {
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface EventReactionPanelOptions extends PositionedBox {
  title?: string;
  stages?: EventReactionStage[];
  browserLabel?: string;
  triggerLabel?: string;
  responseLabel?: string;
  browserNote?: string;
  footer?: string;
}

export interface DomMutationFlowOptions extends PositionedBox {
  title?: string;
  selectorTitle?: string;
  selectorBody?: string;
  mutationTitle?: string;
  mutationBody?: string;
  resultTitle?: string;
  resultBadge?: string;
  resultBody?: string;
  footer?: string;
}

export interface DebugEvidenceCard {
  title?: string;
  body?: string;
  question?: string;
  accent?: string;
  fill?: string;
  icon?: string;
}

export interface DebugEvidenceBoardOptions extends PositionedBox {
  title?: string;
  cards?: DebugEvidenceCard[];
  footer?: string;
}

export interface SpreadsheetProblemHighlight {
  row?: number;
  col?: number;
  accent?: string;
  fill?: string;
}

export interface SpreadsheetProblemCallout {
  title?: string;
  body?: string;
  accent?: string;
  fill?: string;
}

export interface SpreadsheetProblemPanelOptions extends PositionedBox {
  title?: string;
  columns?: string[];
  rows?: string[][];
  highlights?: SpreadsheetProblemHighlight[];
  callouts?: SpreadsheetProblemCallout[];
  footer?: string;
}

export interface BlueprintEntity {
  title?: string;
  icon?: string;
  fields?: string[];
  accent?: string;
  fill?: string;
}

export interface BlueprintRelation {
  from?: number;
  to?: number;
  label?: string;
  accent?: string;
}

export interface EntityRelationshipBlueprintOptions extends PositionedBox {
  title?: string;
  entities?: BlueprintEntity[];
  relations?: BlueprintRelation[];
  footer?: string;
}

export interface NormalizationStage {
  badge?: string;
  title?: string;
  focus?: string;
  note?: string;
  accent?: string;
  fill?: string;
  sample?: string[];
}

export interface NormalizationStepperOptions extends PositionedBox {
  title?: string;
  stages?: NormalizationStage[];
  footer?: string;
}

export interface SqlBridgeTableChip {
  title?: string;
  meta?: string;
  accent?: string;
  fill?: string;
}

export interface SqlBridgePanelOptions extends PositionedBox {
  title?: string;
  tables?: SqlBridgeTableChip[];
  codeTitle?: string;
  codeLines?: string[];
  footer?: string;
}

export interface JsonPanelOptions extends PositionedBox {
  title?: string;
  code?: string;
  fill?: string;
  titleFill?: string;
  fontSize?: number;
}

export interface RequestResponseFlowOptions extends PositionedBox {
  title?: string;
  clientLabel?: string;
  serverLabel?: string;
  requestLabel?: string;
  requestMeta?: string;
  responseLabel?: string;
  responseMeta?: string;
}

export interface ComponentTreeNode {
  label?: string;
  depth?: number;
  meta?: string;
}

export interface ComponentTreeOptions extends PositionedBox {
  title?: string;
  nodes?: ComponentTreeNode[];
}

export type DomTreeTone = "red" | "blue" | "gold" | "neutral";

export interface DomTreeNode {
  tag: string;
  depth?: number;
  tone?: DomTreeTone;
  detail?: string;
  width?: number;
}

export interface DomTreePanelOptions extends PositionedBox {
  title?: string;
  subtitle?: string;
  nodes?: DomTreeNode[];
  rowH?: number;
  rowGap?: number;
  indent?: number;
}

export interface EventLoopDiagramOptions extends PositionedBox {
  stackFrames?: string[];
  apiItems?: string[];
  queueItems?: string[];
  highlightPhase?: "stack" | "apis" | "queue" | "loop";
  fill?: string;
  caption?: string;
  fontSize?: number;
}

export interface SyntaxCompareOptions extends PositionedBox {
  beforeLabel?: string;
  afterLabel?: string;
  beforeCode: string;
  afterCode: string;
  language?: string;
  caption?: string;
  fontSize?: number;
}

export interface TableSchemaColumn {
  name: string;
  type: string;
  key?: "PK" | "FK" | "";
}

export interface TableSchemaOptions extends PositionedBox {
  title?: string;
  columns?: TableSchemaColumn[];
}

export type JoinSetDiagramType = "inner" | "left" | "right" | "full" | "leftOnly" | "rightOnly";

export interface JoinSetDiagramOptions extends PositionedBox {
  type?: JoinSetDiagramType;
  title?: string | false;
  leftLabel?: string;
  rightLabel?: string;
  badge?: string;
  result?: string;
  caption?: string | false;
  fill?: string;
  line?: string;
  headerFill?: string;
  badgeFill?: string;
  leftColor?: string;
  rightColor?: string;
  highlightColor?: string;
  diagramFill?: string;
  pad?: number;
  titleFontSize?: number;
  badgeFontSize?: number;
  captionFontSize?: number;
}

export interface SupabaseProjectSetupPanelOptions extends PositionedBox {
  title?: string;
  leftW?: number;
  organizationName?: string;
  projectName?: string;
  databasePassword?: string;
  regionName?: string;
  planLabel?: string;
  statusItems?: string[];
  tabs?: string[];
  footer?: string;
}

export interface SupabaseTableEditorColumn {
  name: string;
  type: string;
  key?: "PK" | "FK" | "";
}

export interface SupabaseTableEditorPanelOptions extends PositionedBox {
  title?: string;
  leftW?: number;
  tableName?: string;
  columns?: SupabaseTableEditorColumn[];
  relationshipTitle?: string;
  relationshipBody?: string;
  sampleRowTitle?: string;
  sampleValues?: string[];
  footer?: string;
}

export interface ErRelationshipOptions extends PositionedBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  type?: "1:1" | "1:N" | "N:M";
  label?: string;
  color?: string;
}

export interface AgentOrchestrationDiagramOptions extends PositionedBox {
  title?: string;
}

export interface McpBridgePanelOptions extends PositionedBox {
  title?: string;
}

export interface ToolExecutionConsoleOptions extends PositionedBox {
  command?: string;
  params?: Record<string, unknown>;
  result?: string;
}

export interface ValidationLayer {
  name: string;
  status: "OK" | "WARN" | "FAIL";
  desc: string;
  color?: string;
}

export interface ValidationLayerRadarOptions extends PositionedBox {
  title?: string;
  layers?: ValidationLayer[];
}

export interface AgentReasoningLoopOptions extends PositionedBox {
  title?: string;
}

export interface GameAiPanelOptions extends PositionedBox {
  title?: string;
  subtitle?: string;
  [key: string]: unknown;
}

export type AtaxxBoardStateOptions = GameAiPanelOptions;
export type MoveAnatomyPanelOptions = GameAiPanelOptions;
export type MctsSearchPanelOptions = GameAiPanelOptions;
export type PolicyValueArchitectureOptions = GameAiPanelOptions;
export type SelfPlayLoopPanelOptions = GameAiPanelOptions;
export type ModelGenerationTableOptions = GameAiPanelOptions;
export type TournamentRulesPanelOptions = GameAiPanelOptions;

/** Opciones del sello "Vinculación con el Medio" (vcmLockup). */
export interface VcmLockupOptions {
  /** Fondo oscuro: usa la variante blanca del sello. Por defecto false (variante navy). */
  onDark?: boolean;
  /** Ruta a un PNG de sello propio (override del bundleado en assets/vcm). */
  path?: string;
  /** Override de posición/tamaño del sello. */
  pos?: Partial<Bounds>;
}



