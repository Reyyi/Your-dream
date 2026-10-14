const skyFragmentShader = /* glsl */ `
  uniform float uFog;
  uniform vec3 uSkyTop;
  uniform vec3 uHorizon;
  uniform vec3 uLight;
  varying vec2 vUv;

  void main() {
    float elevation = smoothstep(0.02, 0.96, vUv.y);
    vec3 color = mix(uHorizon, uSkyTop, elevation);
    float haze = exp(-pow((vUv.y - 0.28) * 7.5, 2.0)) * uFog;
    color = mix(color, uLight, haze * 0.34);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default skyFragmentShader;
