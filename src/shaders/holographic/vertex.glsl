uniform float uTime;
uniform float uBassGlitch;

varying vec3 vPosition;
varying vec3 vNormal;

float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}


void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // 定常的なグリッチ
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) +  sin(glitchTime * 8.76);
    glitchStrength /= 3.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= 0.1;

    // 低音に連動するグリッチ
    // uBassGlitchが0より大きい時だけ発生
    float bassGlitchStrength = uBassGlitch * sin(glitchTime);

    // 2つのグリッチを合成
    float totalGlitchStrength = glitchStrength + bassGlitchStrength;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * totalGlitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * totalGlitchStrength;


    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Varyings
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}