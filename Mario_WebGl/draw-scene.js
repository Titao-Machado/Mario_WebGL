let ang = 0;
let ultimoTempo = new Date()

function getInd(i,j){
  return i*4+j;
}
function multMat(mat1,mat2){
  const result=[
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
  ]
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      //result[getInd(i,j)]=linha i vezes coluna j
      for(let elm=0;elm<4;elm++){
        result[getInd(i,j)]+=mat1[getInd(i,elm)]*mat2[getInd(elm,j)];
      }
    }
  }
  return result;
}

function getProjection(angfov,near,far,aspect){
  const fov=Math.tan((90-angfov/2)*Math.PI/180);
  const projection=[
    fov/aspect,0,0,0,
    0,fov,0,0,
    0,0,(near+far)/(far-near),1,
    0,0,-2*near*far/(far-near),0
  ];
  return projection;
}

function rotacaoY(ang){
  const angP=ang*Math.PI/180;
  return [
    Math.cos(angP),0,Math.sin(angP),0,
    0,1,0,0,
    -Math.sin(angP),0,Math.cos(angP),0,
    0,0,0,1,
  ]
}

function rotacaoZ(ang){
  const angP=ang*Math.PI/180;
  return [
    Math.cos(angP),Math.sin(angP),0,0,
    -Math.sin(angP),Math.cos(angP),0,0,
    0,0,1,0, 
    0,0,0,1,
  ]
}

function rotacaoX(ang){
  const angP=ang*Math.PI/180;
  return [
    1,0,0,0,
    0,Math.cos(angP),-Math.sin(angP),0,
    0,Math.sin(angP),Math.cos(angP),0,
    0,0,0,1,
  ]
}


function translacao(dx,dy,dz){
  return [
    1,0,0,dx,
    0,1,0,dy,
    0,0,1,dz,
    0,0,0,1
  ]
}
function transposta(mat){
  const transp=[
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
  ]
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      transp[getInd(j,i)]=mat[getInd(i,j)];
    }
  }
  return transp;
}

const keys=[];

function keyD(e){
  keys[e.keyCode]=true;
}
function keyU(e){
  keys[e.keyCode]=false;
}
window.addEventListener("keydown",keyD);

window.addEventListener("keyup",keyU);

let frameAtual = 0;

function checarColisoes(obj, objetosColisao) {
    for (let i = 0; i < objetosColisao.length; i++) {
        if (colisaoRet(obj, objetosColisao[i])) {
            return true; 
        }
    }
    return false; 
}
function drawScene(gl, programInfo, objs) {
	gl.clearColor(0, 0, 0, 1.0); // cor de fundo preta
	gl.clearDepth(1.0); // limpar zbuffer
	gl.enable(gl.DEPTH_TEST); // ligar teste de profundidade
	gl.depthFunc(gl.LEQUAL); // objetos mais proximos escondem os mais afastados
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	// limpar buffers

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 1;
	const zFar = 10;
	//matriz de projeçao ortogonal
	const projectionMatrix = getProjection(45, zNear, zFar, aspect);

	ang += 1;
	const angP = (ang * Math.PI) / 180;

	let modelViewMatrix = translacao(0, 0, 10);

	// Usar nosso codigo de vertex e pixel shader
	gl.useProgram(programInfo.program);

	// linca nossas matrizes com as do shaders
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		new Float32Array(projectionMatrix)
	);

	const mario = objs[1];
	const objetosColisao = objs.slice(3);
	const limite = 7.7;
	const velocidade = 0.15;
	mario.vx = 0;

	//Movimentos
	const anyKeyPressed = Object.values(keys).some((isPressed) => isPressed);
	if (anyKeyPressed) {
		if (keys[37] === true) {
			const tempMario = { ...mario };

			if (tempMario.x > -limite) tempMario.x -= velocidade;

			const temColisao = checarColisoes(tempMario, objetosColisao)
			if (!temColisao) {
				mario.x = tempMario.x;
			}
			const numeroFrames = 4;
			const tamanhoFrame = 1 / numeroFrames;
			const tempo = new Date();

			//Muda o frame a cada 150ms
			if (tempo - ultimoTempo > 100) {
				ultimoTempo = tempo;
				if (frameAtual >= 3) frameAtual = 0;
				else {
					frameAtual++;
				}
			}

			//Muda o frame quando anda
			const texture = [
				(1 - tamanhoFrame * frameAtual),  0,
				(1 - tamanhoFrame * frameAtual),  1,
				(1 - tamanhoFrame * (frameAtual + 1)),  0,
				(1 - tamanhoFrame * (frameAtual + 1)),  1,
			];
			mario.textCoords = texture;
			gl.bindBuffer(gl.ARRAY_BUFFER, mario.textureBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(mario.textCoords),
				gl.STATIC_DRAW
			);
		}

		if (keys[39] === true) {
			const tempMario = { ...mario };

			if (tempMario.x < limite) tempMario.x += velocidade;

			const temColisao = checarColisoes(tempMario, objetosColisao)
			if (!temColisao) {
				mario.x = tempMario.x;
			}

			const numeroFrames = 4;
			const tamanhoFrame = 1 / numeroFrames;
			const tempo = new Date();

			//Muda o frame a cada 150ms
			if (tempo - ultimoTempo > 100) {
				ultimoTempo = tempo;
				if (frameAtual >= 3) frameAtual = 0;
				else {
					frameAtual++;
				}
			}

			//Muda o frame quando anda
			const texture = [
				-(1 - tamanhoFrame * frameAtual),  0,
				-(1 - tamanhoFrame * frameAtual),  1,
				-(1 - tamanhoFrame * (frameAtual + 1)),  0,
				-(1 - tamanhoFrame * (frameAtual + 1)),  1,
			];
			mario.textCoords = texture;
			gl.bindBuffer(gl.ARRAY_BUFFER, mario.textureBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(mario.textCoords),
				gl.STATIC_DRAW
			);
		}
		if (keys[40] === true) {
			const tempMario = { ...mario };

			tempMario.y -= velocidade;

			const temColisao = checarColisoes(tempMario, objetosColisao)
			if (!temColisao) {
				mario.y = tempMario.y;
			}
		}

		if (keys[38] === true) {
			if (mario.vy === 0) {
				const tempMario = { ...mario };

				tempMario.y += tempMario.vy + 0.3;

				const temColisao = checarColisoes(tempMario, objetosColisao)
				if (!temColisao) {
					mario.vy = 0.3;
				} else {
					mario.vy = 0;
				}
			}
		}
	}
	//Se não tiver movimentos volta pro frame parado
	else {
		const tamanhoFrame = 1 / 4;
		const texture = [
			-(1 - tamanhoFrame * 0),  0,
			-(1 - tamanhoFrame * 0),  1,
			-(1 - tamanhoFrame * (0 + 1)),  0,
			-(1 - tamanhoFrame * (0 + 1)),  1,
		];
		mario.textCoords = texture;
		gl.bindBuffer(gl.ARRAY_BUFFER, mario.textureBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(mario.textCoords),
			gl.STATIC_DRAW
		);
	}

	//Código da gravidade
	{
		const tempMario = { ...mario };

		tempMario.y += tempMario.vy - 0.012;

		const temColisao = checarColisoes(tempMario, objetosColisao)
		if (!temColisao) {
			objs[1].vy -= 0.012;
		} else {
			objs[1].vy = 0;
		}
	}

	//Movimento do cogumelo
	{
		const tempCogumelo = { ...objs[2] };
		const temColisao = checarColisoes(tempCogumelo, objetosColisao)
		if (temColisao) {
			objs[2].vx *= -1;
		}
		if (objs[2].x < -7) {
			objs[2].vx *= -1;
		}
	}

	for (const ret of objs) {
		ret.update();
		ret.draw(
			gl,
			modelViewMatrix,
			programInfo.attribLocations.vertexPosition,
			programInfo.attribLocations.vertexTextCoord,
			programInfo.uniformLocations.modelViewMatrix
		);
	}
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	setTimeout(() => drawScene(gl, programInfo, objs), 20);
}
function setColorAttribute(gl,buffers,programInfo){
	const tamanho=3;//R G B
	const tipo= gl.FLOAT;
	const normalizar=false;
	const stride=0;
	const offset =0;
	gl.bindBuffer(gl.ARRAY_BUFFER,buffers.color);
	gl.vertexAttribPointer(
	  programInfo.attribLocations.vertexColor,
	  tamanho,tipo,normalizar,stride,offset);
  
	gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }
  
  function setTextCoordAttribute(gl,buffers,programInfo){
	const tamanho=2; //S,T
	const tipo=gl.FLOAT;
	const normalizar=false;
	const stride=0;
	const offset=0;
	gl.bindBuffer(gl.ARRAY_BUFFER,buffers.textcoord);
	gl.vertexAttribPointer(programInfo.attribLocations.vertexTextCoord,
	  tamanho,tipo,normalizar,stride,offset);
	gl.enableVertexAttribArray(programInfo.attribLocations.vertexTextCoord);
  
  }
  
  
  // configurar como carregar os vertices
  function setPositionAttribute(gl, buffers, programInfo) {
	const numComponents = 3; // dimensoes por vertices
	const type = gl.FLOAT; // tipo de dado
	const normalize = false; // não normalizar os valores
	const stride = 0; // espaço entre os valores
	
	const offset = 0; // quantas posiçoes pular no inicio
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
	gl.vertexAttribPointer(
	  programInfo.attribLocations.vertexPosition,
	  numComponents,
	  type,
	  normalize,
	  stride,
	  offset
	);
	gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }
  
  