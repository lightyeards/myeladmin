// ECharts component registration
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  FunnelChart,
  GaugeChart,
  GraphChart,
  SankeyChart,
  SunburstChart,
  ThemeRiverChart,
  HeatmapChart
} from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  PolarComponent,
  GraphicComponent,
  DataZoomComponent,
  VisualMapComponent,
  RadarComponent,
  MarkPointComponent,
  MarkLineComponent,
  ToolboxComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  FunnelChart,
  GaugeChart,
  GraphChart,
  SankeyChart,
  SunburstChart,
  ThemeRiverChart,
  HeatmapChart,
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  PolarComponent,
  GraphicComponent,
  DataZoomComponent,
  VisualMapComponent,
  RadarComponent,
  MarkPointComponent,
  MarkLineComponent,
  ToolboxComponent,
  DatasetComponent,
  TransformComponent
])
