
function main() {
  const canvas = document.querySelector("#glcanvas");
  // Inicia o contexto do opengl
  const gl = canvas.getContext("webgl", {alpha:true});

  //erro se não conseguiu
  if (gl === null) {
    alert(
      "WebGL não suportado"
    );
    return;
  }

  //Seta a cor do fundo para preto
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // limpa a tela
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vertex shader
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec2 aTextCoord;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    varying lowp vec2 vTextCoord;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
      vTextCoord = aTextCoord; 
    }
`;
  //fragmentShader
  const fsSource = `
    varying lowp vec4 vColor;
    varying lowp vec2 vTextCoord;
    uniform sampler2D imagem;
    void main() {
      gl_FragColor = vColor;
      gl_FragColor = texture2D(imagem,vTextCoord);
    }
  `;

  // inicializa os shaders
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  //link das variaveis nos shaders
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram,"aVertexColor"),
      vertexTextCoord: gl.getAttribLocation(shaderProgram,"aTextCoord")
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  //  cria os buffers
  const buffers = initBuffers(gl);

  // desenha a cena
  drawScene(gl, programInfo, buffers);
}

//
// Inicia o shader
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Cria o shader

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);


  return shaderProgram;
}

//
// compila os shaders
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // envia o codigo para o shader
  gl.shaderSource(shader, source);

  // Compila o codigo

  gl.compileShader(shader);

  // checa se compilou com sucesso

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `Ocorreu um erro compilando: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
