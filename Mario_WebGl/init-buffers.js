function initBuffers(gl) {
	const textures = [
		criarTextura(gl, "fundo.png"),
		criarTextura(gl, "mario2.png"),
		criarTextura(gl, "chao.png"),
		criarTextura(gl, "cano.png"),
		criarTextura(gl, "bloco.png"),
		criarTextura(gl, "luckyblock.png"),
		criarTextura(gl, "tijolo.png"),
		criarTextura(gl, "cogumelo.png"),
	];
	const texturaEspelhada = [-1, 0, -1, 1, 0, 0, 0, 1];
	const objs = [];
	//objs.push(new Retangulo(xNaTela,yNaTela,Largura,Altura, textures[0/1], textura))
	objs.push(new Retangulo(-2, 1.76, 20, 10, textures[0]));
	objs.push(new Retangulo(-4.7, -2.69, 1, 1, textures[1]));
	objs.push(new Retangulo(3.7, -2.69, 1, 1, textures[7]));
	objs.push(new Retangulo(-7.3, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(-6.3, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(-5.3, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(-4.3, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(-3.3, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(-2.3, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(-1.3, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(-0.3, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(0.7, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(1.7, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(2.7, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(3.7, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(4.7, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(5.7, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(6.7, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(7.7, -3.7, 1, 1, textures[2]));
	objs.push(new Retangulo(-4.7, 0, 1, 1, textures[4]));
	objs.push(new Retangulo(-1.7, 0, 1, 1, textures[6]));
	objs.push(new Retangulo(-0.7, 0, 1, 1, textures[4]));
	objs.push(new Retangulo(0.3, 0, 1, 1, textures[6]));
	objs.push(new Retangulo(1.3, 0, 1, 1, textures[5], texturaEspelhada));
	objs.push(new Retangulo(2.3, 0, 1, 1, textures[6]));
	objs.push(new Retangulo(0.3, 3.7, 1, 1, textures[5], texturaEspelhada));
	objs.push(new Retangulo(6.8, -2.2, 2, 2, textures[3]));
	for (const ret of objs) {
		ret.createBuffers(gl);
	}
	objs[2].vx = 0.1;
	return objs;
}
function criarTextura(gl,src){
  const texture=gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA,
     gl.UNSIGNED_BYTE, new Uint8Array([0, 255, 0, 255]));

  const img=new Image();
  img.src=src;
  img.onload=()=>{
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
      gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    
  }
  return texture;  
}

