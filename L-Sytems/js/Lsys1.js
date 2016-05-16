"use strict"

//globals
var Lstring, intervalID, count, canvas, ctx, canvas2, ctx2, ctxa, osc, paul, oldNodes, nodes, neighbors, sound, radius, plucky, container, scene, renderer, camera, mesh, material;
var Vec2 = Victor;
var start = Date.now();
var fov = 30;
var transparency = 0;
var color =  new THREE.Color( 0x000000 ) ;

window.onload = init();

function init(){
	canvas = document.querySelector('canvas');
	ctx = canvas.getContext('2d');
	canvas2 = document.getElementById('top');
	ctx2 = canvas2.getContext('2d');
	container = document.getElementById( "container" );
	sound = false;
	
	var rules = {
		Axiom: "X",
		n: 7, 
		theta: 25.7,
		//F: "F[+F]F[-F]F"
		X: "F[+X][-X]FX",
		F: "FF"
	}
	//set up Tone.js
	plucky = new Tone.PluckSynth().toMaster();
	
	//set up 3js
	scene = new THREE.Scene();	
	camera = new THREE.PerspectiveCamera(fov, window.innerWidth / 1300, 1, 1000);
	camera.position.z = 100;
	camera.target = new THREE.Vector3(0,0,0);
	scene.add(camera);
	//create material
	material = new THREE.ShaderMaterial( {
		/*attributes: {
			alpha: {type: 'f', value: 0.5},
			colorVal: {type: "c", value: [255, 0, 255]}
		},*/
		uniforms: { 
        time: { // float initialized to 0
            type: "f", 
            value: 0.0 
        },
		uCol: { type: "c", value: new THREE.Color( 0x000000 ) }
    },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
} );
	//create sphere and assign material
	mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(20,4), material);
	scene.add(mesh);
	//create renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, 1300 );
	container.appendChild(renderer.domElement);
	render();
	
	radius = 10;
	
	ctxa = new AudioContext();
	
	oldNodes = [];
	nodes = [];
	neighbors = [];
	//nodeNum = 0;
	
	create(rules, 4);//4
}

function create(rules, ct){
	Lstring = rules.Axiom;
	count = 0;
	//var run = true;
	while(count != ct)
	{
		loop(rules);
		count++;
	}
	draw(rules);
}

function loop(rules){
	/*console.log("A = " + rules.A); 
	console.log("B = " + rules.B); */
	
	var newString;
	var length
	
	for(var i = 0; i < count; i++){
		newString = Lstring;
		Lstring = "";
		length = newString.length;
		/*console.log(newString);
		console.log(length);*/
		for(var j = 0; j < length; j++)
		{
			if(newString.charAt(j) == "F")
			{
				Lstring += rules.F;
			}
			else if(newString.charAt(j) == "X")
			{
				Lstring += rules.X;
			}
			else if(newString.charAt(j) == "Y")
			{
				Lstring += rules.Y;
			}
			else{
				Lstring += newString.charAt(j);
			}
		}
	}	
	//console.log(Lstring);	
	//console.log("Final newString" + newString);
	//Lstring = newString;
	//console.log("Lstring = " + Lstring);
}

function draw(rules){
	
	paul = new Turtle(ctx, 1000, 1300);//500, 1300
	
	//console.log("Lstring: "+Lstring);
	var split = Lstring.split("");
	
	var degToRad = function( deg ) {
		//console.log("radian:" + deg * Math.PI / 180);
      return deg * Math.PI / 180;
    }
	
	for(var i = 0; i < split.length; i++)
	{
		if(split[i] == "F"){
			paul.move(rules.n);
		}
		if(split[i] == "+"){
			paul.rotate( degToRad(rules.theta));
		}
		if(split[i] == "-"){
			paul.rotate( degToRad(-rules.theta));
		}
		if(split[i] == "["){
			paul.push();
			/*oldNodes = paul.posArray;
			nodes[nodeNum] = oldNodes;
			console.log("node" + nodes[nodeNum]);
			console.log("nodeFull" + nodes);
			nodeNum++;*/
		}
		if(split[i] == "]"){
			paul.pop();
			//console.log("bracht" + nodes);
		}
		//console.log("nodeFull" + nodes);
		/*nodes = paul.nodeArray;
		console.log("node" + nodes);*/
	}
	ctx.save();
	nodes = unique(paul.nodeArray);
	neighbors = paul.neighbors;
	//neighbors = unique(neighbors);
	console.log("neighbors" + neighbors);
	/*for(var i = 0; i < nodes.length - 1; i++){
		//console.log("node" + nodes[i]);
		var neighbor = [];
		ctx.strokeStyle = 'black';
		ctx.beginPath();
		ctx.arc(nodes[i].x, nodes[i].y, 3, 0,2*Math.PI, false);
		ctx.stroke();
		ctx.fill();
	}*/
}

function unique(array){
	var newArray = [];
	var length = array.length;
	var found;
	for (var x = 0; x < length; x++) {
        found = undefined;
        for (var y = 0; y < newArray.length; y++) {
            if (array[x] === newArray[y]) {
                found = true;
                break;
            }
        }
        if (!found) {
            newArray.push(array[x]);
        }
    }
	
	return newArray;
}

// Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0
var tempY = 0

// Main function to retrieve mouse x-y pos.s

function getMouseXY(e) {
	ctx2.clearRect(0,0, canvas2.width, canvas2.height);
	if(sound == true){
		osc.stop(0);
		ctxa.close();
		ctxa = new AudioContext();
		sound = false;
	}
    tempX = e.pageX
    tempY = e.pageY
  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0}
  if (tempY < 0){tempY = 0}  
  // show the position values in the form named Show
  // in the text fields named MouseX and MouseY

  nodeCheck();
  //render();
  //ctxa.close();
  return true
}

function nodeCheck(){
	  //console.log("Mouse X: "+tempX)
		//console.log("Mouse Y: "+tempY)
	for(var i = 0; i < neighbors.length; i++){
			//console.log("onLine: " + onLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, tempX, tempY));
			if(onLine(neighbors[i][0],neighbors[i][1], tempX, tempY))
			{
				ctx2.strokeStyle = "red";
				ctx2.beginPath();
				ctx2.moveTo( neighbors[i][0].x, neighbors[i][0].y );
				ctx2.lineTo( neighbors[i][1].x, neighbors[i][1].y );
				ctx2.closePath();
				ctx2.stroke();
				audio(neighbors[i][0],neighbors[i][1], tempX, tempY);
			}
	}
}

	

function onLine(startP, endP, px, py){
	//circle collision
	var line = Vec2(endP.x - startP.x, endP.y - startP.y);
	var lineNorm = line.rotate(Math.PI * -0.5);
	var circCent = Vec2(px - startP.x, py - startP.y);
	var circOnNorm = circCent.projectOnto(lineNorm);
	//console.log("CircOnNorm"+circOnNorm);
	if(Math.abs(circOnNorm.length()) <= radius){
		if(px <= Math.max(startP.x, endP.x) && px >= Math.min(startP.x, endP.x) &&
		py <= Math.max(startP.y, endP.y) && py >= Math.min(startP.y, endP.y)){
			console.log("Colliding");
			return true;
		}
	}
	return false;
	/*
	var f = function(somex) { return (endP.y - startP.y) / (endP.x - startP.x) * (somex - startP.x) + startP.y; };
	return Math.abs(f(px) - py) < 1 && px >= startP.x && px <= endP.x;*/
	
}

function audio(startP, endP, px, py){
	
	var line = Vec2(endP.x - startP.x, endP.y - startP.y);
	var mag = line.length();
	var noteLength;
	console.log(mag);
	if(mag < 30){
		noteLength = "8n";
	}
	if(mag < 100){
		noteLength = "4n";
	}
	if(mag > 100){
		noteLength = "2n";
	}
	
	if(startP.y > endP.y){
		//osc.frequency.value = vec1.x;
		console.log("x" + startP.x);
		if(startP.x < 900){ color =  new THREE.Color( 0xffaa00 );
		plucky.triggerAttackRelease("C6", 1000);}
		else if(startP.x < 950){ color =  new THREE.Color( 0x03b3fd );
		plucky.triggerAttackRelease("D6", 1000);}
		else if(startP.x < 1000){ color =  new THREE.Color( 0xfa6ffc );
		plucky.triggerAttackRelease("E6", 1000);}
		else if(startP.x < 1050){ color =  new THREE.Color( 0x02fc25 );
		plucky.triggerAttackRelease("F6", 1000);}
		else if(startP.x < 1100){ color =  new THREE.Color( 0xfc0202);
		plucky.triggerAttackRelease("G6", 1000);}
		else if(startP.x < 1150){ color =  new THREE.Color( 0xfbf5ad );
		plucky.triggerAttackRelease("A7", 1000);}
		else if(startP.x < 1200){ color =  new THREE.Color( 0xdbc0f4 );
		plucky.triggerAttackRelease("B7", 1000);}
	}
	else if(startP.y < endP.y){
		//osc.frequency.value = vec2.x;
		console.log("x" + endP.x);
		//plucky.triggerAttackRelease(endP.x, noteLength);
		if(endP.x < 900){ color =  new THREE.Color( 0xffaa00 );
		plucky.triggerAttackRelease("C6", noteLength);}
		else if(endP.x < 950){ color =  new THREE.Color( 0x03b3fd );
		plucky.triggerAttackRelease("D6", noteLength);}
		else if(endP.x < 1000){ color =  new THREE.Color( 0xfa6ffc );
		plucky.triggerAttackRelease("E6", noteLength);}
		else if(endP.x < 1050){ color =  new THREE.Color( 0x02fc25 );
		plucky.triggerAttackRelease("F6", noteLength);}
		else if(endP.x < 1100){ color =  new THREE.Color( 0xfc0202);
		plucky.triggerAttackRelease("G6", noteLength);}
		else if(endP.x < 1150){ color =  new THREE.Color( 0xfbf5ad );
		plucky.triggerAttackRelease("A7", noteLength);}
		else if(endP.x < 1200){ color =  new THREE.Color( 0xdbc0f4 );
		plucky.triggerAttackRelease("B7", noteLength);}
	}
	//osc.stop(3);
}


function render(){
	material.uniforms[ 'time' ].value = .00025 * ( Date.now() - start ) * ( -tempX / tempY );;
	material.uniforms[ 'uCol' ].value = new THREE.Color( 0xFFFFFF );
	material.uniforms[ 'uCol' ].value = color;
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

/*function checkLine(x1, y1, x2, y2, checks){
	var checking = 0;
	for(var i = 1; i <= checks; i++){
		var c = ctx.getImageData((x1+(i-1)*((x2-x1)/i)),(y1+(i-1)*((y2-y1)/i)),1,1).data;
		//console.log(c);
		if(c != (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)){
			checking++;
		}
	}
	//console.log("checking: "+checking);
	if(checking == checks){
		//console.log("checking: "+true);
		return true;
	}
	else{
		return false;
	}
}*/

/*function nodeButtonCheck(clickX, clickY, nodeX, nodeY)
{
	if((tempY - nodes[i].y)  * (nodes[j].x - nodes[i].x) == (nodes[j].y - nodes[i].y) * (tempX - nodes[i].x))
}
*/
/*var split = Lstring.split("");
	var newString = "";
	for(var i = 0; i < split.length; i++)
	{
		for(var rule in rules){
			//console.log("rule: "+rule + " split[i]: " + split[i]);
			if(split[i] == 'F'){
				newString += rules[rule];
				
				//console.log("newString: " + newString);
			}
			else{
				newString+= split[i];
			}
		}
	}*/
	
	/*
	Main
	Axiom: "X",
		n: 7, 
		theta: 25.7,
		//F: "F[+F]F[-F]F"
		X: "F[+X][-X]FX",
		F: "FF"
		
	Spiral
	Axiom: "++F",
		n: 150, 
		theta: 25,
		//F: "F[+F]F[-F]F"
		//X: "F-[[X]+X]+F[+FX]-X",
		F: "F-[-F+F]"
	*/
//Potential alternate method make fast turtle that traverses tree until it gets close to mouse

/*function nodeCheck(){

	for(var i = 0; i < neighbors.length; i++){
		//if(onLine(neighbors[i][0].x.toFixed(), neighbors[i][0].y.toFixed(), neighbors[i][1].x.toFixed(), neighbors[i][1].y.toFixed(), tempX, tempY))
		//{
			//console.log("length: " + neighbors.length);
			//console.log("i: " + i);
			//console.log("neigbors " + neighbors);
			//if (checkLine(nodes[i].x, nodes[i].y,nodes[j].x, nodes[j].y, 3) == true){
			ctx2.strokeStyle = "red";
			ctx2.beginPath();
			ctx2.moveTo( neighbors[i][0].x, neighbors[i][0].y );
			ctx2.lineTo( neighbors[i][1].x, neighbors[i][1].y );
			ctx2.closePath();
			ctx2.stroke();
			//}
		//}
	}
}*/

/*function nodeCheck(){
	  console.log("Mouse X: "+tempX)
		console.log("Mouse Y: "+tempY)
	for(var i = 0; i < nodes.length; i++){
		for(var j = 0; j < nodes.length; j++){
			//console.log("onLine: " + onLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, tempX, tempY));
			if(onLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, tempX, tempY))
			{
				//if (checkLine(nodes[i].x, nodes[i].y,nodes[j].x, nodes[j].y, 3) == true){
				for(var k = 0; k < neighbors.length; k++){
					if((nodes[i] == neighbors[k][0] || nodes[i] == neighbors[k][1]) && (nodes[j] == neighbors[k][0] || nodes[j] == neighbors[k][1])){
						ctx2.strokeStyle = "red";
						ctx2.beginPath();
						ctx2.moveTo( nodes[i].x, nodes[i].y );
						ctx2.lineTo( nodes[j].x, nodes[j].y );
						ctx2.closePath();
						ctx2.stroke();
					}
				}
			}
		}
	}
}

	/*var circCent = Vec2(px, py);
	var A = Vec2(startP, endP);
	var B = Vec2(startP, circCent);
	var AdotB = startP.dot(endP);
	var BdotB = startP.dot(circCent);
	var ALength = A.x.length();
	var proj = ((AdotB) / BdotB) * B;
	
	var hypeLength = (A.length() * A.length) - (proj.length() * proj.length);
	if(hypeLength < radius){
		return true;
	}
	return false
*/