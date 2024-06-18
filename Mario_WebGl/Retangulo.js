
class Retangulo {
	constructor(x, y, w, h, texture, textCoords = null) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.vx = 0;
		this.vy = 0;
		this.texture = texture;
		if (textCoords == null) {
			this.textCoords = [
                1, 0, 
                1, 1, 
                0, 0, 
                0, 1];
		} else {
			this.textCoords = textCoords;
		}
	}
	createBuffers(gl) {
		this.textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.textCoords),
			gl.STATIC_DRAW
		);

        const pontos=[
            -0.5, 0.5, 0,
            -0.5,-0.5, 0,
             0.5, 0.5, 0,
             0.5,-0.5, 0,
        ]
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pontos), gl.STATIC_DRAW);
	}
	getLocalMatrix() {
		let localModelView=[
            this.w,0,0,0,
            0,this.h,0,0,
            0,0,1,0,
            0,0,0,1,
        ];
		localModelView = multMat(translacao(this.x, this.y, 0), localModelView);
		return localModelView;
	}

	setPositionBuffer(gl, shaderRef) {
		const tamanho = 3;
		const tipo = gl.FLOAT;
		const norm = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.vertexAttribPointer(shaderRef, tamanho, tipo, norm, stride, offset);
		gl.enableVertexAttribArray(shaderRef);
	}
    setTextureBuffer(gl,shaderRef){
        const tamanho=2; //S,T
        const tipo=gl.FLOAT;
        const normalizar=false;
        const stride=0;
        const offset=0;
        gl.bindBuffer(gl.ARRAY_BUFFER,this.textureBuffer);
        gl.vertexAttribPointer(shaderRef,tamanho,tipo,
            normalizar,stride,offset);
        gl.enableVertexAttribArray(shaderRef);
    }

	draw(gl, modelViewMatrix, positionRef, textureRef, modelMatRef) {
		this.setPositionBuffer(gl, positionRef);
		this.setTextureBuffer(gl, textureRef);
		let localMV = multMat(modelViewMatrix, this.getLocalMatrix());
		localMV = transposta(localMV);
		gl.uniformMatrix4fv(modelMatRef, false, new Float32Array(localMV));
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		const offset = 0;
		const count = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, count);
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;
	}
}

function colisaoRet(ret1, ret2) {
	let x1min = ret1.x - ret1.w / 2;
	let x1max = ret1.x + ret1.w / 2;
	let y1min = ret1.y - ret1.h / 2;
	let y1max = ret1.y + ret1.h / 2;

	let x2min = ret2.x - ret2.w / 2;
	let x2max = ret2.x + ret2.w / 2;
	let y2min = ret2.y - ret2.h / 2;
	let y2max = ret2.y + ret2.h / 2;
	if (x2max < x1min) return false;
	if (x1max < x2min) return false;
	if (y1max < y2min) return false;
	if (y1min > y2max) return false;
	return true;
}
