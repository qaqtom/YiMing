import * as Cesium from 'cesium'
const util = `#define LINEAR_INTERP(MIN, MAX, R) ((MIN) + ((MAX) - (MIN)) * (R))\n#define SIGN(x) ((x) < 0. ? -1. : 1.)\n\n#define _IN(x) ((x) > 1e-7)\n#define IN_0_1(x) ((x) > 0. && (x) < 1.)\n\n#define SQRT2 1.41421356237\n#define LOG10 2.30258509299\n#define GRID_SIZE 359.\n#define NLAYER 29\n#define NGRID 5.\n\nconst vec3 radii = vec3(6378137.0, 6378137.0, 6356752.3142451793);\nconst vec3 radii_2 = vec3(40680631590769., 40680631590769., 40408299984661.445);\n\nconst vec3 cAmbientColor = vec3(.1, .1, .1);\nconst vec3 cLightColor = vec3(.9, .9, .9);\nconst vec3 cSpecularColor = vec3(1., 1., 1.);\n\nconst vec3 colorspace1 = vec3(.2126, .7152, .0722);\nconst vec3 colorspace2 = vec3(.299, .587, .114);\n\n\nuniform vec3 uEyePos;\nuniform float uEyeHeight;\nuniform bool uSunlight;\n\nuniform vec3 uColorScheme[16];\nuniform float uGradPos[16];\nuniform float uNColorScheme;\n\nuniform float uHeights[NLAYER];\nuniform float uHeightMag;\nuniform vec2 uHeightRange;\n\nuniform sampler2D uDataTex;\n\nuniform bool uIsMask;\nuniform sampler2D uMaskTex;\n\nuniform bool uIsFilter;\nuniform vec2 uFilterRange;\nuniform vec4 u_min_range_ultmin_ultrange;\n\nfloat normalize2Range(float val,vec2 range){\n    return (val - range.x)/(range.y-range.x);\n}\n\nvec3 wgs84ToCartesian(vec3 p, float heightMagnification) {\n	vec3 vn = vec3(\n		cos(p.y) * cos(p.x),\n		cos(p.y) * sin(p.x),\n		sin(p.y)\n	);\n	vn = normalize(vn);\n\n	vec3 vk = radii_2 * vn;\n	float gamma = sqrt(dot(vn, vk));\n	vk = vk / gamma;\n	vn = vn * p.z * heightMagnification;\n\n	return vk + vn;\n}\n\nvec3 wgs84ToCartesian(vec3 p) {\n    return wgs84ToCartesian(p, 1.);\n}\n\nvec3 cartesianToWgs84(vec3 p) {\n    vec3 p2 = p * p / radii_2;\n    float ratio = sqrt(1. / (p2.x + p2.y + p2.z));\n\n    vec3 intersection = p * ratio;\n    vec3 gradient = intersection / radii_2 * 2.;\n    float lambda = (1. - ratio) * length(p) / (.5 * length(gradient));\n\n    vec3 multiplier = 1. / (1. + lambda / radii_2);\n    vec3 s = p * multiplier;\n\n    vec3 n = normalize(s / radii_2);\n    vec3 h = p - s;\n\n    float lng = atan(n.y, n.x);\n    float lat = asin(n.z);\n    float height = SIGN(dot(h, p)) * length(h);\n\n    return vec3(lng, lat, height);\n}\n\n//in: absolute grid coord\n//out: lng, lat\nvec2 grid2lnglat(vec2 p) {\n    float r = 179.5;\n    float d = 396.219371902;\n    float bias = length(p - vec2(r, r));\n    float lat, lng;\n    lat = 2. * atan(bias / d);\n    lat = czm_piOverTwo - lat;\n    lng = atan((p.x - r) / abs(p.y - r));\n    lng = czm_piOverTwo - lng;\n    lng = lng * SIGN(r - p.y);\n    lng = mod(lng + czm_twoPi + czm_pi / 36., czm_twoPi);\n    lng = lng > czm_pi ? lng - czm_twoPi : lng;\n\n    return vec2(lng, lat);\n}\n\n//in: lng, lat\n//out: relative grid coord (from 0. to 1.)\n/* vec2 lnglat2grid(vec2 lnglat) {\n    /* float r = 179.5;\n    float c = 396.219371902;\n    float d = lnglat.x - 5. / 180. * czm_pi;\n    float l = tan((czm_piOverTwo - lnglat.y) / 2.) * c;\n    \n    vec2 xy = vec2(r + cos(d) * l, r - sin(d) * l);\n    xy /= r * 2.;\n    return clamp(xy, 0., 1.); \n    //长顺代码\n    //float d = lnglat.x/czm_pi*180.0 + 180.0;\n    //float l = 90.0 - lnglat.y/czm_pi*180.0;\n    float d = lnglat.x/czm_pi*180.0 - origin_x;\n    float l = origin_y - lnglat.y/czm_pi*180.0;\n    \n    vec2 xy = vec2(d, l);\n    xy /= vec2(360.0,180.0);\n    //return xy;\n    return clamp(xy, 0., 1.);\n\n} */\n\nfloat decodeValue(vec3 cv) {\n    float a = (cv.r + cv.g + cv.b) / 3.;\n#ifdef _FN\n    vec4 v = u_min_range_ultmin_ultrange;\n    float b = a * v.w + v.z;\n	float c = _FN(b);\n	float d = (c - v.x) / v.y;\n	return d;\n#else\n    return a;\n#endif\n}\n\nfloat decodeValueByUV(vec2 texCoord) {\n	vec3 clr = texture(uDataTex, texCoord).rgb;\n    return decodeValue(clr);\n}\n\nvec3 computeColor(float val) {\n	vec3 ret;\n    int n = int(uNColorScheme);\n\n    for (int k = 0; k < 16; k++) {\n        float vmin = uGradPos[k];\n        float span = uGradPos[k + 1] - vmin;\n        ret = LINEAR_INTERP(uColorScheme[k], uColorScheme[k + 1], (val - vmin) / span);\n\n        if (k == n - 2 || uGradPos[k + 1] > val)\n            break;\n    }\n\n	return ret;\n}\n\nvec3 rgb2luminosity(vec3 rgb) \n{\n	float l = dot(rgb, colorspace2);\n	return vec3(l, l, l);\n}\n\nvec3 reverseColor(vec3 clr)\n{\n	return vec3(1., 1., 1.) - clr;\n}\n\nvec4 pack_0_1(float v) {\n    vec4 bitSh = vec4(1., 255., 65025., 16581375.) * v;\n    vec4 bitMsk= vec4(1./255., 1./255., 1./255., 0.);\n    vec4 bits = fract(bitSh);\n    bits -= bits.yzww * bitMsk;\n    return bits;\n}\n\nvec3 float2int24(float v) {	\n	const vec3 bitSh = vec3(\n		256.,\n		256. * 256.,\n		256. * 256. * 256.\n	);\n	const vec3 bitMsk = vec3(\n		0.,\n		1. / 256.,\n		1. / 256.\n	);\n	vec3 int24 = fract(v / bitSh);\n	int24 -= int24.xxy * bitMsk;\n\n	return int24;\n}`

let _cvs_filter = null
let _ev_handler = null
let _box_coords = []
// let _shader

class BasePrimitive {
  constructor(scene) {
    this.scene = scene

    this._inited = false
    this._data_tex = undefined
    this._mask_tex = undefined
    this.czm_w = 0
    this.czm_h = 0

    this._vp_supported = false
    this._is_charting = false
    this._is_sFilter = false
    this._sFilter_name = undefined

    this._util_shader = util

    Cesium.Texture.prototype.updateTexture = function (img) {
      var gl = this._context._gl
      var texture = this._texture
      var errcode

      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this._flipY)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      errcode = gl.getError()
      gl.bindTexture(gl.TEXTURE_2D, null)

      return errcode != gl.INVALID_VALUE
    }

    // _shader = this.loadFile('/shaders/util2.glsl')
  }

  init(scene, options) {
    if (this._inited) return

    this._heights = [
      114.70226, 316.00092, 521.47827, 731.59033, 946.74554, 1167.2693, 1393.5048, 1625.7402, 1864.2783, 2109.4243,
      2361.5364, 2620.8948, 2887.8713, 3163.127, 3446.8784, 3739.8081, 4042.7754, 4355.9395, 4680.5977, 5017.6216,
      5367.3184, 6111.9146, 6924.9897, 7823.8384, 8834.7783, 10005.09, 11425.004, 13264.112, 15848.298,
    ]

    this.data = Cesium.defaultValue(options.data, null)
    this.show = Cesium.defaultValue(options.show, true)
    this.layerNum = Cesium.defaultValue(options.layerNum, { from: 1, to: 10 })
    this.heightMag = Cesium.defaultValue(options.heightMag, 200)
    this.spatialFilter = Cesium.defaultValue(options.spatialFilter, 'None')
    this.initMaskTex = Cesium.defaultValue(options.initMaskTex, false)

    this.valueFilter = Cesium.defaultValue(options.valueFilter, {})
    this.valueFilter.enabled = Cesium.defaultValue(this.valueFilter.enabled, false)
    this.valueFilter.vmin = Cesium.defaultValue(this.valueFilter.vmin, 0)
    this.valueFilter.vmax = Cesium.defaultValue(this.valueFilter.vmax, 1)
    this.valueFilter.from = Cesium.defaultValue(this.valueFilter.from, this.valueFilter.vmin)
    this.valueFilter.to = Cesium.defaultValue(this.valueFilter.to, this.valueFilter.vmax)
    this.valueFilter.nlt_min = this.valueFilter.vmin
    this.valueFilter.nlt_max = this.valueFilter.vmax
    this.valueDecoder = 'x'

    this.setColorScheme(options.colorScheme)

    this._uniforms = {
      uEyePos: () => {
        return scene.camera.position
      },
      uEyeHeight: () => {
        return scene.camera.positionCartographic.height
      },
      uSunlight: () => {
        return scene.isSunlightEnabled()
      },

      uNColorScheme: () => {
        return this.colorScheme.length
      },
      uColorScheme: () => {
        return this.colorScheme
      },
      uGradPos: () => {
        return this.legendGradPos
      },

      uHeights: () => {
        return this._heights
      },
      uHeightMag: () => {
        return this.heightMag
      },
      uHeightRange: () => {
        var min = this._heights[this.layerNum.from - 1]
        var max = this._heights[this.layerNum.to - 1]
        return new Cesium.Cartesian2(min, max)
      },

      uDataTex: () => {
        return this._data_tex
      },
      uIsMask: () => {
        return this._is_sFilter
      },
      uMaskTex: () => {
        return this._mask_tex
      },
      uIsFilter: () => {
        return this.valueFilter.enabled
      },
      uFilterRange: () => {
        let vf = this.valueFilter
        let min = (vf.from - vf.vmin) / (vf.vmax - vf.vmin)
        let max = (vf.to - vf.vmin) / (vf.vmax - vf.vmin)
        return new Cesium.Cartesian2(min, max)
      },
      u_min_range_ultmin_ultrange: () => {
        let vf = this.valueFilter
        return new Cesium.Cartesian4(vf.vmin, vf.vmax - vf.vmin, vf.nlt_min, vf.nlt_max - vf.nlt_min)
      },
    }

    this._data_tex = new Cesium.Texture({
      context: scene.context,
      width: 1,
      height: 1,
      flipY: false,
      sampler: new Cesium.Sampler({
        minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
        magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE,
        wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE,
      }),
    })

    if (options.initMaskTex) {
      this._mask_tex = new Cesium.Texture({
        context: scene.context,
        width: 1,
        height: 1,
        flipY: false,
        sampler: new Cesium.Sampler({
          minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
          magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        }),
      })
    }

    this.initialize(scene.context, options)

    this._inited = true
  }

  initialize() {}
  render() {}
  onDataReady() {}
  onResize() {}
  dispose() {}
  onAdjust() {}

  save(obj) {
    if (!obj.legend) {
      obj.legend = {
        color: this.legendCodes.map(function (x) {
          return x.substr(1)
        }),
        pos: this.legendGradPos,
      }
    }
    if (!obj.vFilter) {
      obj.vFilter = {
        enabled: this.valueFilter.enabled,
        from: this.valueFilter.from,
        to: this.valueFilter.to,
      }
    }
    if (!obj.sFilter) {
      obj.sFilter = {
        isFilter: this._is_sFilter,
        filterName: this._sFilter_name,
      }
    }
  }

  load(obj) {
    this.setValueFilter(obj.vFilter.enabled, obj.vFilter)
    this.setSpatialFilter(obj.sFilter)
    this.setColorScheme(this.clr2arr(obj.legend.color))
    this.legendGradPos = obj.legend.pos
  }

  clr2arr(clr) {
    if (!(clr instanceof Array)) clr = [clr]
    var arr = clr
      .join()
      .replace(/[,#]/g, '')
      .match(/.{1,2}/g)
    var ret = arr.map(function (i) {
      var r = 0
      try {
        r = parseInt(i, 16) / 255
      } catch (err) {
        console.log('🚀 ~ file: Data.vue ~ line 53 ~ ret ~ err', err)
      }
      return r
    })
    return ret
  }

  sync(prim) {
    this.colorScheme = prim.colorScheme
    this.legendCodes = prim.legendCodes
    this.legendGradPos = prim.legendGradPos

    this.setValueFilter(prim.valueFilter.enabled, prim.valueFilter)
    this.setSpatialFilter({ isFilter: prim._is_sFilter, filterName: prim._sFilter_name })
  }

  update(frameState) {
    var context = frameState.context
    var commandList = frameState.commandList

    if (!this.show || frameState.mode !== Cesium.SceneMode.SCENE3D) return

    if (!this.data._gpu_cached) {
      this._data_tex.updateTexture(this.data)
      this.data._gpu_cached = true
      this.onDataReady(context)
    }

    if (this.czm_w != context.drawingBufferWidth || this.czm_h != context.drawingBufferHeight) {
      this.czm_w = context.drawingBufferWidth
      this.czm_h = context.drawingBufferHeight

      this.onResize(context, this.czm_w, this.czm_h)
    }

    this.render(context, commandList)
  }

  destroy() {
    this._data_tex = this._data_tex && this._data_tex.destroy()
    this._mask_tex = this._mask_tex && this._mask_tex.destroy()

    this.dispose()

    return Cesium.destroyObject(this)
  }

  isDestroyed() {
    return false
  }

  setVisible(showed) {
    this.show = showed
    if (!showed) {
      this.data._gpu_cached = false
    }
  }

  setColorScheme(arr) {
    if (!arr || !arr.length || arr.length < 6) arr = [0, 0, 1, 1, 1, 0, 1, 0, 0]

    this.colorScheme = []
    this.legendCodes = []
    this.legendGradPos = []

    var step = 1 / (~~(arr.length / 3) - 1)

    for (var i = 0; i < arr.length; i += 3) {
      this.colorScheme.push(new Cesium.Cartesian3(arr[i], arr[i + 1], arr[i + 2]))

      var c = 1 << 24
      for (var k = 2, b = 0; k > -1; k--, b += 8) c += ~~(255 * arr[i + k]) << b
      this.legendCodes.push('#' + c.toString(16).substring(1))
      this.legendGradPos.push((i / 3) * step)
    }
  }

  latlng2grid(lng, lat) {
    let r = 179.5
    let c = 396.219371902
    let d = Math.radians(lng - 5)
    let l = Math.tan(Math.radians((90 - lat) / 2)) * c
    let y = r - Math.sin(d) * l
    let x = r + Math.cos(d) * l

    var overflow = x < 0 || x > 359 || y < 0 || y > 359
    x = Math.min(x, 359)
    x = Math.max(x, 0)
    y = Math.min(y, 359)
    y = Math.max(y, 0)

    return [x, y, overflow]
  }

  setSpatialFilter(options) {
    if (!options) return

    _box_coords = []
    _ev_handler = _ev_handler && _ev_handler.destroy()
    // updatePositionSelecting(null)

    this._is_sFilter = options.isFilter && (this._sFilter_name = options.filterName) !== undefined
    if (!this._is_sFilter || !this._mask_tex) return

    if (options.filterName == 'Draw Box') {
      var c = (_cvs_filter = _cvs_filter || document.createElement('canvas'))
      var ctx = c.getContext('2d')
      c.width = 1024
      c.height = 1024
      ctx.clearRect(0, 0, c.width, c.height)
      this._mask_tex.updateTexture(c)

      var mask_tex = this._mask_tex
      var ellipsoid = this.scene.globe.ellipsoid
      _ev_handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas)

      _ev_handler.setInputAction(function (movement) {
        var cartesian = this.scene.camera.pickEllipsoid(movement.endPosition, ellipsoid)
        if (cartesian) {
          var cartographic = ellipsoid.cartesianToCartographic(cartesian)
          var lat = Math.degrees(cartographic.latitude)
          var lng = Math.degrees(cartographic.longitude)
          var gpos = this.latlng2grid(lng, lat)
          // updatePositionSelecting(gpos[2] ? [] : [lat, lng])

          if (_box_coords.length > 0) {
            var r = 1023 / 359
            var x = _box_coords[0].x
            var y = _box_coords[0].y
            var w = gpos[0] - x
            var h = gpos[1] - y
            ctx.clearRect(0, 0, c.width, c.height)
            ctx.fillRect(x * r, y * r, w * r, h * r)
            mask_tex.updateTexture(c)
          }
        } else {
          // updatePositionSelecting(null)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      _ev_handler.setInputAction(function (movement) {
        var cartesian = this.scene.camera.pickEllipsoid(movement.position, ellipsoid)
        if (cartesian) {
          var cartographic = ellipsoid.cartesianToCartographic(cartesian)
          var lat = Math.degrees(cartographic.latitude)
          var lng = Math.degrees(cartographic.longitude)
          var gpos = this.latlng2grid(lng, lat)
          if (!gpos[2]) {
            _box_coords.push({ x: gpos[0], y: gpos[1] })
          }
          if (_box_coords.length == 2) {
            _box_coords = []
            _ev_handler = _ev_handler && _ev_handler.destroy()
            // updatePositionSelecting(null)
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

      return
    }

    var img = new Image()
    img.height = 1024
    img.width = 1024
    img.prim = this
    img.src = 'svg/' + this._sFilter_name + '.svg'
    img.onload = function () {
      var c = (_cvs_filter = _cvs_filter || document.createElement('canvas'))
      var ctx = c.getContext('2d')
      c.width = this.width
      c.height = this.height
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.drawImage(this, 0, 0, this.width, this.height)
      this.prim._mask_tex.updateTexture(c)
    }
  }

  getSpatialFilterName() {
    return this._is_sFilter ? this._sFilter_name : undefined
  }

  setValueFilter(enabled, range) {
    this.valueFilter.enabled = enabled
    if (enabled && range) {
      this.valueFilter.from = range.from
      this.valueFilter.to = range.to
    }
  }

  loadFile(fileName) {
    var request = new XMLHttpRequest()
    request.open('GET', fileName, false)
    request.send()

    return request.responseText
  }
}

export default BasePrimitive
