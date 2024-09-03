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
