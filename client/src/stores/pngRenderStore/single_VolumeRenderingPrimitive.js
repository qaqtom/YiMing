import BasePrimitive from './BasePrimitive'
import {
    Buffer,
    Math,
    ShaderSource,
    ShaderProgram,
    RenderState,
    CullFace,
    BlendFunction,
    BoundingSphere,
    Cartesian3,
    DrawCommand,
    Pass,
    BufferUsage,
    IndexDatatype,
    VertexArray,
    ComponentDatatype,
    PrimitiveType,
} from 'cesium'

import _shader from './VolumeRendering.glsl?raw'

export default class single_VolumeRenderingPrimitive extends BasePrimitive {
    constructor(scene, options) {
        // super(scene, Object.assign(options, { initMaskTex: true }))

        super(scene)

        if (options) this.init(scene, Object.assign(options, { initMaskTex: true }))
    }
    initialize(context, options) {
        this._va = this.init_va(context, options)
        this._uniforms.voHeight = () => {
            return options.height
        }
        this._uniforms.origin_x = () => {
            return options.originX
        }
        this._uniforms.origin_y = () => {
            return options.originY
        }
        this._uniforms.x_length = () => {
            return options.xLength
        }
        this._uniforms.y_length = () => {
            return options.yLength
        }
        this._sp = ShaderProgram.replaceCache({
            context: context,
            shaderProgram: this._sp,
            vertexShaderSource: new ShaderSource({
                sources: [this._util_shader, _shader],
                defines: ['_DRAW_', '_VS_'],
            }),
            fragmentShaderSource: new ShaderSource({
                sources: [this._util_shader, _shader],
                defines: ['_DRAW_', '_FS_'],
            }),
            attributeLocations: {
                position: 0,
            },
        })
        const _rs = RenderState.fromCache({
            cull: {
                enabled: true,
                face: CullFace.FRONT,
            },
            depthTest: {
                enabled: true,
            },
            depthMask: true,
            blending: {
                enabled: true,
                functionSourceRgb: BlendFunction.SOURCE_ALPHA,
                functionSourceAlpha: BlendFunction.SOURCE_ALPHA,
                functionDestinationRgb: BlendFunction.ONE_MINUS_SOURCE_ALPHA,
                functionDestinationAlpha: BlendFunction.ONE_MINUS_SOURCE_ALPHA,
            },
        })
        const _bs = new BoundingSphere(Cartesian3.ZERO, 1e9)
        this._cmd_draw = new DrawCommand({
            owner: this,
            renderState: _rs,
            boundingVolume: _bs,
            vertexArray: this._va,
            shaderProgram: this._sp,
            uniformMap: this._uniforms,
            primitiveType: PrimitiveType.TRIANGLE_STRIP,
            pass: Pass.OPAQUE,
        })
    }
    init_va(context, options) {
        const x_size = options.xGridSize + 1
        const y_size = options.yGridSize + 1
        const origin_x = options.originX
        const origin_y = options.originY
        const x_interval = options.xInterval
        const y_interval = options.yInterval
        if (this._grid === undefined) {
            const g = (this._grid = new Array(x_size * y_size * 2))
            let index = 0
            for (let i = 0; i < x_size; i++) {
                for (let j = 0; j < y_size; j++) {
                    const lng = Math.toRadians(origin_x + i * x_interval)
                    const lat = Math.toRadians(origin_y - j * y_interval)
                    g[index] = lng
                    g[index + 1] = lat
                    index += 2
                }
            }
        }
        let ai = 0
        const arr = new Float32Array(x_size * y_size * 3 * 2)
        for (let hi = 1; hi > -2; hi -= 2) {
            for (let i = 0; i < x_size; i++) {
                for (let j = 0; j < y_size; j++) {
                    const index = (i * y_size + j) * 2
                    const lng = this._grid[index]
                    const lat = this._grid[index + 1]
                    arr[ai] = lng
                    arr[ai + 1] = lat
                    arr[ai + 2] = hi
                    ai += 3
                }
            }
        }
        const vertexBuffer = Buffer.createVertexBuffer({
            context: context,
            typedArray: arr,
            usage: BufferUsage.STATIC_DRAW,
        })
        const indices = []
        for (let i = 0; i < x_size - 1; i++) {
            for (let j = 0; j < y_size; j++) {
                indices.push(j + i * y_size)
                indices.push(j + (i + 1) * y_size)
            }
            indices.push((i + 2) * y_size - 1)
            if (i == x_size - 2) {
                indices.push(y_size - 1)
            } else {
                indices.push((i + 1) * y_size)
            }
        }
        indices.push(y_size - 1)
        indices.push(x_size * y_size + y_size - 1)
        for (let i = 0; i < x_size; i++) {
            indices.push(x_size * y_size + y_size - 1 + i * y_size)
            indices.push(y_size - 1 + i * y_size)
        }
        for (let j = y_size - 2; j > -1; j--) {
            indices.push(x_size * y_size + j + (x_size - 1) * y_size)
            indices.push(j + (x_size - 1) * y_size)
        }
        indices.push(x_size * y_size - y_size)
        indices.push(x_size * y_size * 2 - y_size)
        for (let i = x_size - 1; i > 0; i--) {
            for (let j = 0; j < y_size; j++) {
                indices.push(x_size * y_size + j + i * y_size)
                indices.push(x_size * y_size + j + (i - 1) * y_size)
            }
            indices.push(x_size * y_size + i * y_size - 1)
            indices.push(x_size * y_size + (i - 1) * y_size)
        }
        indices.push(x_size * y_size)
        indices.push(x_size * y_size * 2 - y_size)
        for (let i = x_size - 1; i > -1; i--) {
            indices.push(x_size * y_size + i * y_size)
            indices.push(i * y_size)
        }
        for (let j = 1; j < y_size; j++) {
            indices.push(x_size * y_size + j)
            indices.push(j)
        }
        const indexBuffer = Buffer.createIndexBuffer({
            context: context,
            typedArray: new Uint32Array(indices),
            usage: BufferUsage.STATIC_DRAW,
            indexDatatype: IndexDatatype.UNSIGNED_INT,
        })
        const vertexInfo = new VertexArray({
            context: context,
            attributes: [
                {
                    index: 0,
                    enabled: true,
                    vertexBuffer: vertexBuffer,
                    componentsPerAttribute: 3,
                    componentDatatype: ComponentDatatype.FLOAT,
                    normalize: false,
                    offsetInBytes: 0,
                    strideInBytes: 0,
                },
            ],
            indexBuffer: indexBuffer,
        })
        vertexBuffer && vertexBuffer.destroy()
        indexBuffer && indexBuffer.destroy()
        return vertexInfo
    }
    render(context, cmdlist) {
        cmdlist.push(this._cmd_draw)
    }
    onDataReady() { }
    onResize() { }
    dispose() {
        this._sp = this._sp && this._sp.destroy()
        this._va = this._va && this._va.destroy()
    }
    onAdjust() { }
    save(obj) {
        super.save(obj)
        obj.volrender_opt = {
            layerNum: this.layerNum,
            heightMag: this.heightMag,
        }
    }
    load(obj) {
        super.load(obj)
        const options = obj.volrender_opt
        this.updateGeometry({
            layerNum: options.layerNum,
            heightMag: options.heightMag,
        })
    }
    updateGeometry(options) {
        if (!options) {
            return
        }
        const ret = { autoHeight: undefined }
        if (options.heightMag || ret.autoHeight) {
            this.heightMag = options.heightMag || ret.autoHeight
        }
        return ret
    }
}
