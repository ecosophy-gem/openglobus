<script id="shader-vs" type="x-shader/x-vertes">
    attribute vec3 a_position;
    void main(){
    gl_Position = vec4(a_position,1.0);
}
</script>
<script id="shader-fs" type="x-shader/x-fragment">
    precision mediump float;
    void main(){
    gl_FragColor = vec4(1,0,0.5,1);
}
</script>
<script type="module">
    'use strict';
    import * as math from '../../src/og/math.js';
    import { RenderNode } from '../../src/og/scene/RenderNode.js';
    import { Program } from '../../src/og/webgl/Program.js';
    import { Globe } from '../../src/og/Globe.js';
    import { XYZ } from '../../src/og/layer/XYZ.js';
    import { GlobusTerrain } from '../../src/og/terrain/GlobusTerrain.js';
    import { wgs84 } from '../../src/og/ellipsoid/wgs84.js';
    import { LonLat } from '../../src/og/LonLat.js';
    class MyScene extends RenderNode {
    constructor() {
    super("MyScene");
    this.vericesBuffer = null;
}
    init() {
    this.renderer.handler.addProgram(new Program("myShader", {
    attributes: {
    'a_position': 'vec3'
},
    vertexShader: document.getElementById("shader-vs").innerHTML,
    fragmentShader: document.getElementById("shader-fs").innerHTML
}));
    var p1 = wgs84.lonLatToCartesian(new LonLat(0,0,1000)).normal();
    var p2 = wgs84.lonLatToCartesian(new LonLat(20,0,5000)).normal();
    var p3 = wgs84.lonLatToCartesian(new LonLat(10,20,1000)).normal();
    var positions = [
    p1.x, p1.y, p1.z,
    p2.x, p2.y, p2.z,
    p3.x, p3.y, p3.z,
    ]
    this.vericesBuffer = this.renderer.handler.createArrayBuffer(new Float32Array(positions), 3, positions.length / 3);
}
    frame() {
    var r = this.renderer;
    var sh = r.handler.programs.myShader;
    var p = sh._program;
    var gl = r.handler.gl;
    sh.activate();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vericesBuffer);
    gl.vertexAttribPointer(p.attributes.a_position, this.vericesBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}
}
    let osm = new XYZ("OpenStreetMap", {
    isBaseLayer: true,
    url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    visibility: true,
    attribution: 'Data @ OpenStreetMap contributors, ODbL'
});
    let globus = new Globe({
    "target": "globus",
    "name": "Earth",
    "terrain": new GlobusTerrain(),
    "layers": [osm]
});
    globus.renderer.addNodes([new MyScene()]);
</script>