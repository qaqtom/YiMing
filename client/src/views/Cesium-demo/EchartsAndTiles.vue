<template>
    <HightCode :code/>
    <div class="container" ref="panelDom">
        <Panel size="medium" title="echarts联动瓦片变化">
            <div class="content">
                <div class="list">
                    <div class="item">
                        <div class="name">加载</div>
                        <el-switch v-model="isRender" @change="handleRender" />
                    </div>
                </div>
            </div>
        </Panel>

        <el-dialog v-model="isRender" draggable class="dialog" :modal="false" :close-on-click-modal="false" :lock-scroll="false"  modal-class="test">
            <template #header>
            <div class="dialogHeader">海岸线动态演变机制可视化</div>
            </template>
            <v-chart ref="chartRef" class="echarts" autoresize />
            <div class="currentDate">当前时间：{{ marks[currentIndex] }}</div>

            <div class="slider-demo-block">
            <div class="demonstration" @click="togglePlay">
                <el-icon v-if="isPlaying">
                    <i-ep-videoPause />
                </el-icon>
                <el-icon v-else>
                    <i-ep-videoPlay />
                </el-icon>
                <!-- {{ isPlaying ? '暂停' : '播放' }} -->
            </div>
            <el-slider v-model="currentIndex" :step="1" show-stops :mix="0" :max="dataLength"
                :format-tooltip="formatTooltip" />
            </div>
            <div class="Date">
            <div>起始时间：{{ marks[0] }}</div>
            <div class="speed">
                <span style="vertical-align: -3px;margin-right: 10px">倍速:</span>
                <el-select v-model="speed" style="width: 60px" size="small">
                <el-option label="3x" :value="200" />
                <el-option label="2x" :value="500" />
                <el-option label="1.5x" :value="750" />
                <el-option label="正常" :value="1000" />
                <el-option label="0.5x" :value="2000" />
                </el-select>
            </div>
            <div>结束时间：{{ marks[dataLength] }}</div>
            </div>
        </el-dialog>        
    </div>
</template>

<script setup lang="ts">
import { useViewerStore } from '@/stores/cesiumStore'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount,ref,provide,watch } from 'vue';
import { UrlTemplateImageryProvider, ImageryLayer, Color, Cartesian3, Viewer } from 'cesium';
import url from '@/baseURL'
import HightCode from '@/components/Code/Code.vue';

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GraphChart } from 'echarts/charts'
import { TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { type EChartsOption, type ECharts, number } from 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'
import axios from 'axios';
provide(THEME_KEY, 'dark')
use([CanvasRenderer, GraphChart, TooltipComponent, TitleComponent, LegendComponent])

const open = () => {
  ElNotification.success({
    title: '成功',
    message: '渲染成功',
    offset: 500,
  })
}
const panelDom = ref<HTMLElement>(); 
const chartRef = ref<ECharts>()
const currentIndex = ref(0)
const marks = ref<any>({})
const viewerStore = useViewerStore()
let { viewer } = storeToRefs(viewerStore)
const isRender = ref(false)
const isPlaying = ref(false)
const dataLength = ref(10)
// const pngRenderStore = usePngRenderStore()

interface GraphDataType {
  nodes: NodeType[]
  links: LinkType[]
}

interface NodeType {
  name: string
  des?: string
  category: number
  symbolSize: number
  fixed?: boolean
  x?: number
  y?: number
}

interface LinkType {
  source: string
  target: string
  name: string
  value: number
  width: number
}

interface DataResponseType {
  json_datas: GraphDataType[] // 将 graphDataType 替换为 json_datas 的实际类型
  newfiles_path: string[]
}

let originData: { graphData: GraphDataType[], path: string[] };

const categories = [{ name: '风' }, { name: '波浪' }, { name: '潮汐' }, { name: '隐藏' }]

const commonNodeStyle = { label: { show: true } }

const commonLinkStyle = (link: LinkType) => ({
  lineStyle: {
    width: link.width,
    type: link.name.includes('负相关') ? 'dashed' : 'solid',
  },
})

const processNodes = (nodes: NodeType[]) => {
  return nodes.map((node) => ({
    ...node,
    ...commonNodeStyle,
  }))
}

const processLinks = (links: LinkType[]) => {
  return links.map((link) => ({
    ...link,
    ...commonLinkStyle(link),
  }))
}


let currentData: GraphDataType

let imageLayers: ImageryLayer[] = []; // 用于存储所有图层

watch(currentIndex, (newVal, oldVal) => {
  if (imageLayers[oldVal]) {
    imageLayers[oldVal].alpha = 0.0; // 隐藏旧图层
  }
  if (imageLayers[newVal]) {
    imageLayers[newVal].alpha = 1.0; // 显示新图层
  }
  currentData = { nodes: originData.graphData[newVal].nodes, links: originData.graphData[newVal].links }

  chartRef.value!.setOption({
    series: [
      {
        data: processNodes(currentData.nodes),
        links: processLinks(currentData.links)
      }
    ]
  })
});




const handleRender = async (value: boolean | string | number) => {
    if (value) {
      if (!viewer.value) {
          ElNotification.error({
              title: '失败',
              message: '渲染失败,cesium实例未加载完毕，请稍后重试',
              offset: 500,
          })
          isRender.value = false
          return
      }
      let _viewer = viewer.value as unknown as Viewer
      const loadingInstance = ElLoading.service({
          target:panelDom.value,
          text: "渲染中，请稍后",
          background: 'rgba(0, 0, 0, 0.7)',
      })
      
      const { data }: { data: DataResponseType } = (await axios.get(`${url}/json/data.json`)).data;
      originData = {
          graphData: data.json_datas,
          path: data.newfiles_path
      };
      dataLength.value = originData.path.length - 1;
      marks.value = originData.path.reduce((acc:any, path, index) => {
          const date = path.split('/').pop();
          acc[index] = date;
          return acc;
      }, {});
      currentData = { nodes: originData.graphData[0].nodes, links: originData.graphData[0].links }
      let option: EChartsOption = {
      legend: {
        data: categories.slice(0, -1).map((item) => item.name),
        top: 20,
        itemGap: 20,
        textStyle: {
          // color: '#000', // 设置图例文本的颜色
          fontSize: 20,  // 设置图例文本的大小
          fontWeight: 'bold'
        }
      },
      tooltip: {
        formatter: function (param:any) {
          if (!param.data.des) {
            return param.data.source + ' 与 ' + param.data.target + '的关系为：' + param.data.name
          } else {
            return param.data.name + '<br>' + param.data.des
          }
        },
      },
      series: [
        {
          // name: '动力关系图谱',
          animationDuration: 10000, // 延长动画时间
          animationEasing: 'cubicOut', // 使用平滑的缓动函数
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: 1500,
            edgeLength: [50, 200],
          },
          draggable: true,
          edgeSymbol: ['none', 'arrow'],
          roam: true,
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          },
          lineStyle: { color: 'source', curveness: 0.3 },
          focusNodeAdjacency: true,
          data: processNodes(currentData.nodes),
          links: processLinks(currentData.links),
          categories: categories,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'grey',
              borderWidth: 2,
            },
            label: { fontSize: 20 },
            focus: 'series',
          },
        },
      ],
      } as EChartsOption
      chartRef.value!.setOption(option)
      // 预加载所有图层
      originData.path.forEach((path, index) => {
          const provider = new UrlTemplateImageryProvider({
          url: `${url}${path}/{z}/{x}/{y}.png`,
          });
          const layer = new ImageryLayer(provider);
          layer.colorToAlpha = Color.fromAlpha(Color.BLACK, 0.0)
          layer.alpha = 0.0; // 初始隐藏
          _viewer.imageryLayers.add(layer);
          imageLayers.push(layer);
      });
      imageLayers[0].alpha = 1.0;
      loadingInstance.close()
      currentIndex.value = 0;
      _viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(115.802107, 10.734409, 400),
          duration: 2.0,
      });
      _viewer.scene.globe.depthTestAgainstTerrain = false;
      open()
    } else {
      if (imageLayers.length) {
        let _viewer = viewer.value as unknown as Viewer
          imageLayers.forEach(layer => {
              _viewer.imageryLayers.remove(layer,false);
          });
          imageLayers = [];
      }
    }
}

const formatTooltip = (val:any) => {
  return marks.value[val]
}

const speed = ref(1000);
let playTimer: any;
const playNext = () => {
  if (!isPlaying.value) return;

  if (currentIndex.value < dataLength.value) {
    currentIndex.value++;
    playTimer = setTimeout(playNext, speed.value);
  } else {
    isPlaying.value = false;
  }
};

const togglePlay = () => {
  if (!isPlaying.value) {
    if (currentIndex.value >= dataLength.value) {
      currentIndex.value = 0;
    }
    isPlaying.value = true;
    playNext();
  } else {
    isPlaying.value = false;
    clearTimeout(playTimer);
  }
};

onBeforeUnmount(() => {
    if (imageLayers.length && viewer.value) {
      let _viewer = viewer.value as unknown as Viewer
      imageLayers.forEach(layer => {
        _viewer.imageryLayers.remove(layer,false);
      });
    }
});
const code = `
-------------------------------template代码-------------------------------
<div class="container" ref="panelDom">
    <Panel size="medium" title="echarts联动瓦片变化">
        <div class="content">
            <div class="list">
                <div class="item">
                    <div class="name">加载</div>
                    <el-switch v-model="isRender" @change="handleRender" />
                </div>
            </div>
        </div>
    </Panel>

    <el-dialog v-model="isRender" draggable class="dialog" :modal="false" :close-on-click-modal="false" :lock-scroll="false"  modal-class="test">
        <template #header>
        <div class="dialogHeader">海岸线动态演变机制可视化</div>
        </template>
        <v-chart ref="chartRef" class="echarts" autoresize />
        <div class="currentDate">当前时间：{{ marks[currentIndex] }}</div>

        <div class="slider-demo-block">
        <div class="demonstration" @click="togglePlay">
            <el-icon v-if="isPlaying">
                <i-ep-videoPause />
            </el-icon>
            <el-icon v-else>
                <i-ep-videoPlay />
            </el-icon>
            <!-- {{ isPlaying ? '暂停' : '播放' }} -->
        </div>
        <el-slider v-model="currentIndex" :step="1" show-stops :mix="0" :max="dataLength"
            :format-tooltip="formatTooltip" />
        </div>
        <div class="Date">
        <div>起始时间：{{ marks[0] }}</div>
        <div class="speed">
            <span style="vertical-align: -3px;margin-right: 10px">倍速:</span>
            <el-select v-model="speed" style="width: 60px" size="small">
            <el-option label="3x" :value="200" />
            <el-option label="2x" :value="500" />
            <el-option label="1.5x" :value="750" />
            <el-option label="正常" :value="1000" />
            <el-option label="0.5x" :value="2000" />
            </el-select>
        </div>
        <div>结束时间：{{ marks[dataLength] }}</div>
        </div>
    </el-dialog>        
</div>
-------------------------------script代码-------------------------------
import { useViewerStore } from '@/stores/cesiumStore'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount,ref,provide,watch } from 'vue';
import { UrlTemplateImageryProvider,ImageryLayer,Color,Cartesian3, Viewer } from 'cesium';
import HightCode from '@/components/Code/Code.vue';

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GraphChart } from 'echarts/charts'
import { TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { type EChartsOption, type ECharts, number } from 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'
import axios from 'axios';
provide(THEME_KEY, 'dark')
use([CanvasRenderer, GraphChart, TooltipComponent, TitleComponent, LegendComponent])

const open = () => {
  ElNotification.success({
    title: '成功',
    message: '渲染成功',
    offset: 500,
  })
}
const panelDom = ref<HTMLElement>(); 
const chartRef = ref<ECharts>()
const currentIndex = ref(0)
const marks = ref<any>({})
const viewerStore = useViewerStore()
let { viewer } = storeToRefs(viewerStore)
const isRender = ref(false)
const isPlaying = ref(false)
const dataLength = ref(10)
// const pngRenderStore = usePngRenderStore()

interface GraphDataType {
  nodes: NodeType[]
  links: LinkType[]
}

interface NodeType {
  name: string
  des?: string
  category: number
  symbolSize: number
  fixed?: boolean
  x?: number
  y?: number
}

interface LinkType {
  source: string
  target: string
  name: string
  value: number
  width: number
}

interface DataResponseType {
  json_datas: GraphDataType[] // 将 graphDataType 替换为 json_datas 的实际类型
  newfiles_path: string[]
}

let originData: { graphData: GraphDataType[], path: string[] };

const categories = [{ name: '风' }, { name: '波浪' }, { name: '潮汐' }, { name: '隐藏' }]

const commonNodeStyle = { label: { show: true } }

const commonLinkStyle = (link: LinkType) => ({
  lineStyle: {
    width: link.width,
    type: link.name.includes('负相关') ? 'dashed' : 'solid',
  },
})

const processNodes = (nodes: NodeType[]) => {
  return nodes.map((node) => ({
    ...node,
    ...commonNodeStyle,
  }))
}

const processLinks = (links: LinkType[]) => {
  return links.map((link) => ({
    ...link,
    ...commonLinkStyle(link),
  }))
}


let currentData: GraphDataType

let imageLayers: ImageryLayer[] = []; // 用于存储所有图层

watch(currentIndex, (newVal, oldVal) => {
  if (imageLayers[oldVal]) {
    imageLayers[oldVal].alpha = 0.0; // 隐藏旧图层
  }
  if (imageLayers[newVal]) {
    imageLayers[newVal].alpha = 1.0; // 显示新图层
  }
  currentData = { nodes: originData.graphData[newVal].nodes, links: originData.graphData[newVal].links }

  chartRef.value!.setOption({
    series: [
      {
        data: processNodes(currentData.nodes),
        links: processLinks(currentData.links)
      }
    ]
  })
});




const handleRender = async (value: boolean | string | number) => {
    if (value) {
      if (!viewer.value) {
          ElNotification.error({
              title: '失败',
              message: '渲染失败,cesium实例未加载完毕，请稍后重试',
              offset: 500,
          })
          isRender.value = false
          return
      }
      let _viewer = viewer.value as unknown as Viewer
      const loadingInstance = ElLoading.service({
          target:panelDom.value,
          text: "渲染中，请稍后",
          background: 'rgba(0, 0, 0, 0.7)',
      })
      const { data }: { data: DataResponseType } = (await axios.get('/json/data.json')).data;
      originData = {
          graphData: data.json_datas,
          path: data.newfiles_path
      };
      dataLength.value = originData.path.length - 1;
      marks.value = originData.path.reduce((acc:any, path, index) => {
          const date = path.split('/').pop();
          acc[index] = date;
          return acc;
      }, {});
      currentData = { nodes: originData.graphData[0].nodes, links: originData.graphData[0].links }
      let option: EChartsOption = {
      legend: {
        data: categories.slice(0, -1).map((item) => item.name),
        top: 20,
        itemGap: 20,
        textStyle: {
          // color: '#000', // 设置图例文本的颜色
          fontSize: 20,  // 设置图例文本的大小
          fontWeight: 'bold'
        }
      },
      tooltip: {
        formatter: function (param:any) {
          if (!param.data.des) {
            return param.data.source + ' 与 ' + param.data.target + '的关系为：' + param.data.name
          } else {
            return param.data.name + '<br>' + param.data.des
          }
        },
      },
      series: [
        {
          // name: '动力关系图谱',
          animationDuration: 10000, // 延长动画时间
          animationEasing: 'cubicOut', // 使用平滑的缓动函数
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: 1500,
            edgeLength: [50, 200],
          },
          draggable: true,
          edgeSymbol: ['none', 'arrow'],
          roam: true,
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          },
          lineStyle: { color: 'source', curveness: 0.3 },
          focusNodeAdjacency: true,
          data: processNodes(currentData.nodes),
          links: processLinks(currentData.links),
          categories: categories,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'grey',
              borderWidth: 2,
            },
            label: { fontSize: 20 },
            focus: 'series',
          },
        },
      ],
      } as EChartsOption
      chartRef.value!.setOption(option)
      // 预加载所有图层
      originData.path.forEach((path, index) => {
          const provider = new UrlTemplateImageryProvider({
          url: 'path/{z}/{x}/{y}.png;',//此处自行改为模板字符串
          });
          const layer = new ImageryLayer(provider);
          layer.colorToAlpha = Color.fromAlpha(Color.BLACK, 0.0)
          layer.alpha = 0.0; // 初始隐藏
          _viewer.imageryLayers.add(layer);
          imageLayers.push(layer);
      });
      imageLayers[0].alpha = 1.0;
      loadingInstance.close()
      currentIndex.value = 0;
      _viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(115.802107, 10.734409, 400),
          duration: 2.0,
      });
      _viewer.scene.globe.depthTestAgainstTerrain = false;
      open()
    } else {
      if (imageLayers.length) {
        let _viewer = viewer.value as unknown as Viewer
          imageLayers.forEach(layer => {
              _viewer.imageryLayers.remove(layer,false);
          });
          imageLayers = [];
      }
    }
}

const formatTooltip = (val:any) => {
  return marks.value[val]
}

const speed = ref(1000);
let playTimer: any;
const playNext = () => {
  if (!isPlaying.value) return;

  if (currentIndex.value < dataLength.value) {
    currentIndex.value++;
    playTimer = setTimeout(playNext, speed.value);
  } else {
    isPlaying.value = false;
  }
};

const togglePlay = () => {
  if (!isPlaying.value) {
    if (currentIndex.value >= dataLength.value) {
      currentIndex.value = 0;
    }
    isPlaying.value = true;
    playNext();
  } else {
    isPlaying.value = false;
    clearTimeout(playTimer);
  }
};

onBeforeUnmount(() => {
    if (imageLayers.length && viewer.value) {
      let _viewer = viewer.value as unknown as Viewer
      imageLayers.forEach(layer => {
        _viewer.imageryLayers.remove(layer);
      });
    }
});
---------------------------------css代码----------------------------------------------------
.container{
    position:absolute;
    right:0;
    top:100px;
    z-index:100;
    // pointer-events: all;
}
.content {
    padding: 20px;
}

.sub-title {
    color: #ffffff;
    background-color: #043272;
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .item {
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        /* 设置光标为指针 */

        .index {
            width: 21px;
            height: 21px;
            padding: 0 4px;
            background-color: rgba(255, 119, 52, 0.5);
            border: 1px solid rgba(255, 119, 52, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            flex: 0;
        }

        .name {
            color: #ffffff;
            font-size: 16px;
        }
    }
}

:deep(.dialog){
  pointer-events: all;
  margin: 0;
  position: absolute;
  left: 170px;
  top: 50%;
  transform: translateY(-50%);
  width: 30%;
  background: linear-gradient(180deg, rgba(9, 96, 140, 1) 0%, rgba(30, 30, 32, 1) 100%);
}

:deep(.test){
  pointer-events:none;
}

.dialogHeader {
  text-align: center;
}
.echarts {
  width: 100%;
  height: 500px;

}
.currentDate {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: center
}
.slider-demo-block {
  max-width: 600px;
  display: flex;
  align-items: center;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  flex: 0 0 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
  font-size: 35px;
  text-align: center;
  cursor: pointer;
  color: rgb(64, 158, 255);

  &:hover {
    color: rgb(51, 117, 185);
  }
}

.slider-demo-block .demonstration+.el-slider {
  flex: 0 1 80%;
}
.Date {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
}
.currentDate {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: center
}
`
</script>

<style lang="less" scoped>
.container{
    position:absolute;
    right:0;
    top:100px;
    z-index:100;
    // pointer-events: all;
}
.content {
    padding: 20px;
}

.sub-title {
    color: #ffffff;
    background-color: #043272;
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .item {
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        /* 设置光标为指针 */

        .index {
            width: 21px;
            height: 21px;
            padding: 0 4px;
            background-color: rgba(255, 119, 52, 0.5);
            border: 1px solid rgba(255, 119, 52, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            flex: 0;
        }

        .name {
            color: #ffffff;
            font-size: 16px;
        }
    }
}

:deep(.dialog){
  pointer-events: all;
  margin: 0;
  position: absolute;
  left: 170px;
  top: 50%;
  transform: translateY(-50%);
  width: 30%;
  background: linear-gradient(180deg, rgba(9, 96, 140, 1) 0%, rgba(30, 30, 32, 1) 100%);
}

:deep(.test){
  pointer-events:none;
}

.dialogHeader {
  text-align: center;
}
.echarts {
  width: 100%;
  height: 500px;

}
.currentDate {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: center
}
.slider-demo-block {
  max-width: 600px;
  display: flex;
  align-items: center;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  flex: 0 0 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
  font-size: 35px;
  text-align: center;
  cursor: pointer;
  color: rgb(64, 158, 255);

  &:hover {
    color: rgb(51, 117, 185);
  }
}

.slider-demo-block .demonstration+.el-slider {
  flex: 0 1 80%;
}
.Date {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
}
.currentDate {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: center
}
 
</style>