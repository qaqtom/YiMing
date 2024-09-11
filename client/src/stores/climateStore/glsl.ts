export const fogShader = /*glsl*/ `
#version 300 es
precision highp float;
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform float fogFactorDenominator; // 新增的uniform
in vec2 v_textureCoordinates;
out vec4 fragColor;

void main(void)
{
  vec4 origcolor = texture(colorTexture, v_textureCoordinates);
  vec4 fogcolor = vec4(0.8, 0.8, 0.8, 0.5);

  float depth = czm_readDepth(depthTexture, v_textureCoordinates);
  vec4 depthcolor = texture(depthTexture, v_textureCoordinates);

  float f = (depthcolor.r - 0.22) / fogFactorDenominator; // 使用uniform
  if (f < 0.0) f = 0.0;
  else if (f > 1.0) f = 1.0;

  fragColor = mix(origcolor, fogcolor, f);
}
`

export const snowShader = /*glsl*/ `  
    uniform sampler2D colorTexture;  
    in vec2 v_textureCoordinates;  
    uniform float snowSpeed;  
    uniform float snowSize;  

    float snow(vec2 uv, float scale) {  
        float time = czm_frameNumber / snowSpeed;  
        float w = smoothstep(1., 0., -uv.y * (scale / 10.));  
        if (w < .1) return 0.;  
        uv += time / scale;  
        uv.y += time * 2. / scale;  
        uv.x += sin(uv.y + time * .5) / scale;  
        uv *= scale;  
        vec2 s = floor(uv), f = fract(uv), p;  
        float k = 3., d;  
        p = .5 + .35 * sin(11. * fract(sin((s + p + scale) * mat2(7, 3, 6, 5)) * 5.)) - f;  
        d = length(p);  
        k = min(d, k);  
        k = smoothstep(0., k, sin(f.x + f.y) * snowSize);  
        return k * w;  
    }  

    out vec4 fragColor;  

    void main(void) {  
        vec2 resolution = czm_viewport.zw;  
        vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);  
        vec3 finalColor = vec3(0.);  
        float c = 0.;  
        c += snow(uv, 30.) * .0;  
        c += snow(uv, 20.) * .0;  
        c += snow(uv, 15.) * .0;  
        c += snow(uv, 10.);  
        c += snow(uv, 8.);  
        c += snow(uv, 6.);  
        c += snow(uv, 5.);  
        finalColor = (vec3(c));  
        fragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(finalColor, 1), .5);  
    }  
`;  

export const rainShader = /*glsl*/`
uniform sampler2D colorTexture;
in vec2 v_textureCoordinates;
uniform float tiltAngle;
uniform float rainSize;
uniform float rainSpeed;

float hash(float x) {
    return fract(sin(x * 133.3) * 13.13);
}

out vec4 fragColor;

void main(void) {
    float time = czm_frameNumber / rainSpeed;
    vec2 resolution = czm_viewport.zw;
    vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
    vec3 c = vec3(.6, .7, .8);
    float a = tiltAngle;
    float si = sin(a), co = cos(a);
    uv *= mat2(co, -si, si, co);
    uv *= length(uv + vec2(0, 4.9)) * rainSize + 1.;
    float v = 1. - sin(hash(floor(uv.x * 100.)) * 2.);
    float b = clamp(abs(sin(20. * time * v + uv.y * (5. / (2. + v)))) - .95, 0., 1.) * 20.;
    c *= v * b;
    fragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(c, 1), .5);
}
`
