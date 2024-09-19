<template>
  <div>
    <svg :style="{ width: width + 'px', height: height + 'px' }" class="legend">
      <g transform="translate(0,20)" v-show="colors.length > 0">
        <g transform="translate(0, -12)">
          <text class="axis">{{ title }}</text>
        </g>
        <g ref="labelContainer" :transform="`translate(${svgWidth + 3}, 0)`">
          <g v-for="(label, index) in labels" :key="`label-${index}`" :transform="`translate(0,${label.yTranslate})`">
            <line x2="6" y2="0" />
            <text dy=".32em" x="12" y="0" fill="#E5EAF3">{{ label.text }}</text>
          </g>
          <path class="domain" d="M6,0H0V200H6" />
        </g>
        <rect v-for="(color, index) in computedColors" :key="index" :width="svgWidth" height="2" x="0" :y="index"
          :style="{ opacity: '1', fill: color }" />
      </g>
    </svg>
  </div>
</template>
<script>
import { scaleLinear } from 'd3-scale'
import { name2clr } from '@/stores/pngRenderStore/color';

export default {
  name: 'ColorLegend',
  props: {
    title: String,
    colors: {
      type: Array,
      default: () => {
        return Object.assign([], name2clr('panoply'))
      },
    },
    max: Number,
    min: Number,
    unit: String,
    width: {
      type: Number,
      default: 120,
    },
    height: {
      type: Number,
      default: 250,
    },
    pngdate: String,
  },
  data() {
    return {
      showSchemes: false,
      showText: true,
      schemeColors: [],
      schemeName: this.colorSchemeName,
      svgWidth: 0,
    }
  },
  computed: {
    labels() {
      const { unit, max, min } = this,
        linear = scaleLinear().domain([0, 10]).range([min, max]),
        labels = []

      for (let i = 0; i < 11; i++) {
        let text = parseFloat(linear(i)).toFixed(2) + unit
        if (i != 0 && i != 5 && i != 10) {
          text = ''
        }
        labels.push({
          text: text,
          yTranslate: 200 - i * 20,
        })
      }
      return labels
    },
    computedColors() {
      const colors = this.colors.slice(),
        colorLength = colors.length,
        computedColors = [],
        domain = []
      for (let i = 0; i < colorLength; i++) {
        domain.push((200 / (colorLength - 1)) * i)
      }
      const linear = scaleLinear().domain(domain).range(colors.reverse())

      for (let i = 0; i < 200; i++) {
        computedColors.push(linear(i))
      }
      return computedColors
    },
  },
  mounted() {
    this.svgWidth = this.width - this.$refs.labelContainer.getBBox().width - 10
  },
  methods: {},
}
</script>
<style>
.legend {
  position: fixed;
  bottom: 100px;
  right: 500px;
  background-color: rgba(3, 25, 46, 0.9);
  padding: 8px;
}

.legend line {
  fill: none;
  stroke: white;
  shape-rendering: crispEdges;
}

.legend-title {
  position: fixed;
  top: 90px;
  font-size: 30px;
  width: 300px;
  text-align: center;
  left: calc(50vw - 150px);
}

.domain {
  fill: none;
  stroke: white;
  shape-rendering: crispEdges;
}

.axis {
  font-family: sans-serif;
  font-size: 14px;
  color: white;
  fill: white;
}

.axis2 {
  font-family: sans-serif;
  font-size: 12px;
  color: white;
  fill: white;
}
</style>