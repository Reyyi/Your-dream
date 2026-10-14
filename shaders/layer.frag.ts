const layerFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uTint;
  uniform vec3 uFogColor;
  uniform float uFog;
  uniform float uTime;
  uniform float uEdgeNoise;
  varying vec2 vUv;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  void main() {
    vec4 source = texture2D(uMap, vUv);
    float edgeNoise = (hash21(floor(vUv * 170.0)) - 0.5) * uEdgeNoise;
    float alpha = smoothstep(0.08 + edgeNoise, 0.22 + edgeNoise, source.a);
    float distanceFog = uFog * (0.32 + (1.0 - vUv.y) * 0.68);
    vec3 painted = source.rgb * uTint;
    vec3 color = mix(painted, uFogColor, distanceFog);

    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default layerFragmentShader;
