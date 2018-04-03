//Vector editor for PICO-8 by David Andersen
//https://github.com/davidwardandersen

let palette=[
	[0,0,0,255],[29,43,83,255],[126,37,83,255],[0,135,81,255],
	[171,82,54,255],[95,87,79,255],[194,195,199,255],[255,241,232,255],
	[255,0,77,255],[255,163,0,255],[255,240,36,255],[0,231,86,255],
	[41,173,255,255],[131,118,156,255],[255,119,168,255],[255,204,170,255]
];

let refImage;
let gui={};
let polys=[];
let packInput;
let unpackInput;
let stringLength;
let loadButton;

let selectKey=16;
let deselectKey=18;
let deleteKey=90;
let selectAllKey=65;
let deselectAllKey=83;
let edgesKey=81;
let transparencyKey=87;

//let vertMenu=false;
//let dragging=false;

function setup() {
	let size=min([windowWidth,windowHeight,1000]);
	let myCanvas=createCanvas(size,size);
	myCanvas.parent("p5Canvas");
	myCanvas.drop(gotFile);
	for(let i=0;i<16;i++){
		polys[i]=new Poly();
	}
	setupGui();
	//unpack(testString);
}

function draw() {
	background(127);
	gui.draw();
}

function gotFile(file){
  if (file.type==='image'){
    refImage=createImg(file.data).hide();
  }
}

//  .d8888b.  888     888 8888888
// d88P  Y88b 888     888   888
// 888    888 888     888   888
// 888        888     888   888
// 888  88888 888     888   888
// 888    888 888     888   888
// Y88b  d88P Y88b. .d88P   888
//  "Y8888P88  "Y88888P"  8888888

function setupGui(){
	gui.block=min(width/22,height/22);
	gui.canvas=new GuiCanvas(1,1,17,17,128,128,gui.block);
	gui.tool=new GuiTool(1,0,17,1,17,1,gui.block);
	gui.fill=new GuiColor(1,18,17,1,17,1,gui.block);
	gui.line=new GuiColor(1,19,16,1,16,1,gui.block);
	gui.layer=new GuiLayer(18,1,1,17,1,17,gui.block);
	gui.vertGroup=new GuiVertGroup(19,1,1,16,1,16,gui.block);
	//gui.vertMenu=false;
	gui.strokeWeight=max(round(gui.canvas.cellWidth/2),1);
	gui.vertDrag=false;
	gui.vertClick=false;
	gui.midpointClick=false;
	gui.canvasClick=false;
	// gui.vertBoxDrag=false;
	gui.vertBox=false;
	gui.vertSelection=false;
	gui.layerDrag=false;
	gui.showEdges=true;
	gui.transparency=false;
	packInput=select('#packInput');
	// packInput=createInput('');
	// packInput.position(gui.block*7,gui.block*20+gui.block*0.25);
	// packInput.size(gui.block*10,gui.block*0.5);
	unpackInput=select('#unpackInput');
	// unpackInput=createInput('');
	// unpackInput.position(gui.block*7,gui.block*21+gui.block*0.25);
	// unpackInput.size(gui.block*10,gui.block*0.5);
	stringLength=select('#stringLength');

	gui.click=function(){
		// if(gui.vertMenu){
		// 	gui.vertMenu.click();
		// }else{
		gui.canvas.click();
		gui.fill.click('fill');
		gui.line.click('line');
		gui.layer.click();
		gui.vertGroup.click();
		// }
	}

	gui.release=function(){
		if(gui.canvasClick){
			if(keyIsDown(selectKey)){
				let cell=gui.canvas.canvasToCell(mouseX,mouseY);
				polys[gui.layer.selected].addVertex(cell.x,cell.y);
			}
			// let verts=polys[gui.layer.selected].verts[gui.vertGroup.selected];
			// if(verts.length===0){
			// 	createSquarePoly();
			// }
			gui.canvasClick=false;
		}
		if(gui.vertClick){
			gui.vertClick.pin=!gui.vertClick.pin;
			gui.vertClick=false;
		}
		if(gui.midpointClick){
			gui.midpointClick.vert.color=!gui.midpointClick.vert.color;
			gui.midpointClick=false;
		}
		if(gui.vertDrag){
			gui.vertDrag=false;
		}
		if(gui.vertBox){
			// gui.canvas.selected=polys[gui.layer.selected].select(gui.canvas.select(gui.vertBoxDrag));
			// if(!gui.vertBox.release()){
			// 	polys[gui.layer.selected].deselectVerts();
			// }
			// if(keyIsDown(90)){ // X key
			// 	let verts=polys[gui.layer.selected].verts[gui.vertGroup.selected];
			// 	for(let i=0;i<verts.length;i++){
			// 		if(verts[i].selected){
			// 			verts[i].delete=true;
			// 		}
			// 	}
			// gui.canvas.selected=false;
			// }
			gui.vertBox.release();
			gui.vertBox=false;
		}
		if(gui.layerDrag!==false){ // Have to do it this way because layer 0 registers as false
			gui.layer.release();
			gui.layerDrag=false;
		}
	}

	gui.resize=function(){
		gui.block=min(width/22,height/22);
		gui.canvas=new GuiCanvas(1,1,17,17,128,128,gui.block);
		gui.tool=new GuiTool(1,0,17,1,17,1,gui.block);
		gui.fill=new GuiColor(1,18,17,1,17,1,gui.block);
		gui.line=new GuiColor(1,19,16,1,16,1,gui.block);
		gui.layer=new GuiLayer(18,1,1,17,1,17,gui.block);
		gui.vertGroup=new GuiVertGroup(19,1,1,16,1,16,gui.block);
		gui.strokeWeight=max(round(gui.canvas.cellWidth/2),1);
	}

	gui.draw=function(){
		gui.fill.draw();
		gui.line.draw();
		gui.layer.draw();
		gui.vertGroup.draw();
		gui.canvas.draw();
		if(gui.vertMenu){
			gui.vertMenu.draw();
		}
		// textSize(24);
		// textAlign(LEFT,CENTER);
		let string=pack();
		// text('String length: '+string.length,gui.block*1,gui.block*21);
		packInput.value(string);
		stringLength.html('String length: '+string.length);
	}
}

function windowResized(){
	let size=min([windowWidth,windowHeight,1000]);
	resizeCanvas(size,size);
	gui.resize();
}

//  .d8888b.        d8888 888b    888 888     888     d8888  .d8888b.
// d88P  Y88b      d88888 8888b   888 888     888    d88888 d88P  Y88b
// 888    888     d88P888 88888b  888 888     888   d88P888 Y88b.
// 888           d88P 888 888Y88b 888 Y88b   d88P  d88P 888  "Y888b.
// 888          d88P  888 888 Y88b888  Y88b d88P  d88P  888     "Y88b.
// 888    888  d88P   888 888  Y88888   Y88o88P  d88P   888       "888
// Y88b  d88P d8888888888 888   Y8888    Y888P  d8888888888 Y88b  d88P
//  "Y8888P" d88P     888 888    Y888     Y8P  d88P     888  "Y8888P"

function GuiCanvas(x,y,width,height,columns,rows,block){
	Grid.call(this,x,y,width,height,columns,rows,block);
	this.selected=false;
	this.mainCanvas=createGraphics(128,128);
}

GuiCanvas.prototype=Object.create(Grid.prototype);
GuiCanvas.prototype.constructor=GuiCanvas;

GuiCanvas.prototype.getHitbox=function(){
	let offset=gui.canvas.cellWidth;
	return new Grid(mouseX-offset*1.5,mouseY-offset*1.5,offset*3,offset*3);
}

GuiCanvas.prototype.click=function(){
	if(this.contains(mouseX,mouseY)){
		if (!polys[gui.layer.selected].click()){
			gui.canvasClick={x:mouseX,y:mouseY};
		}
	}
}

// GuiCanvas.prototype.select=function(point){
// 	let x=constrain(mouseX,this.x,this.x+this.width);
// 	let y=constrain(mouseY,this.y,this.y+this.height);
// 	let x1=min(point.x,x);
// 	let y1=min(point.y,y);
// 	let x2=max(point.x,x);
// 	let y2=max(point.y,y);
// 	return new Grid(x1,y1,x2-x1,y2-y1);
// }

GuiCanvas.prototype.draw=function(){
	push();
	if(gui.canvasClick){
		let point=gui.canvasClick;
		if(magnitude(point.x,point.y,mouseX,mouseY)>this.cellWidth*2){
			gui.vertBox=new VertBox(point.x,point.y);
			gui.canvasClick=false;
		}
	}
	if(refImage){
		noSmooth();
		image(refImage,this.x,this.y,this.width,this.height);
		fill(127,127);
		rect(this.x,this.y,this.width,this.height);
	}
	noFill();
	stroke(0);
	strokeWeight(gui.strokeWeight);
	rect(this.x,this.y,this.width,this.height);
	this.mainCanvas.clear();
	for(let i=0;i<16;i++){
		this.mainCanvas.image(polys[i].canvas,0,0);
	}
	noSmooth();
	if(gui.transparency){
		tint(255,127);
	}
	// for(let i=0;i<16;i++){
	// 	image(polys[i].canvas,this.x,this.y,this.width,this.height);
	// }
	image(this.mainCanvas,this.x,this.y,this.width,this.height);
	polys[gui.layer.selected].draw();
	if(gui.vertBox){
		gui.vertBox.draw();
	}
	// if(refImage){
	// 	noSmooth();
	// 	tint(150,50);
	// 	image(refImage,this.x,this.y,this.width,this.height);
	// 	fill(127,127);
	// 	rect(this.x,this.y,this.width,this.height);
	// }
	// if(this.contains(mouseX,mouseY)){
	// 	let hitbox=this.getHitbox();
	// 	stroke(0);
	// 	strokeWeight(gui.strokeWeight);
	// 	if(keyIsDown(selectKey)){
	// 		fill(41,173,255,127);
	// 		rect(hitbox.x,hitbox.y,hitbox.width,hitbox.height);
	// 	}else if(keyIsDown(deselectKey)){
	// 		fill(255,255,255,127);
	// 		rect(hitbox.x,hitbox.y,hitbox.width,hitbox.height);
	// 	}else if(keyIsDown(deleteKey)){
	// 		fill(255,0,77,127);
	// 		rect(hitbox.x,hitbox.y,hitbox.width,hitbox.height);
	// 	}
	// }
	pop();
}

// 88888888888 .d88888b.   .d88888b.  888
//     888    d88P" "Y88b d88P" "Y88b 888
//     888    888     888 888     888 888
//     888    888     888 888     888 888
//     888    888     888 888     888 888
//     888    888     888 888     888 888
//     888    Y88b. .d88P Y88b. .d88P 888
//     888     "Y88888P"   "Y88888P"  88888888

function GuiTool(x,y,width,height,columns,rows,block){
	Grid.call(this,x,y,width,height,columns,rows,block);
	this.selected=false;
}

GuiTool.prototype=Object.create(Grid.prototype);
GuiTool.prototype.constructor=GuiTool;

//  .d8888b.   .d88888b.  888      .d88888b.  8888888b.
// d88P  Y88b d88P" "Y88b 888     d88P" "Y88b 888   Y88b
// 888    888 888     888 888     888     888 888    888
// 888        888     888 888     888     888 888   d88P
// 888        888     888 888     888     888 8888888P"
// 888    888 888     888 888     888     888 888 T88b
// Y88b  d88P Y88b. .d88P 888     Y88b. .d88P 888  T88b
//  "Y8888P"   "Y88888P"  88888888 "Y88888P"  888   T88b

function GuiColor(x,y,width,height,columns,rows,block){
	Grid.call(this,x,y,width,height,columns,rows,block);
}

GuiColor.prototype=Object.create(Grid.prototype);
GuiColor.prototype.constructor=GuiColor;

GuiColor.prototype.click=function(mode){
	if(this.contains(mouseX,mouseY)){
		let button=this.canvasToIndex(mouseX,mouseY);
		if(mode==='fill'){
			polys[gui.layer.selected].fillColor=button;
		}else if(mode==='line'){
			polys[gui.layer.selected].lineColor=button;
		}
	}
}

GuiColor.prototype.draw=function(){
	push();
	stroke(0);
	strokeWeight(gui.strokeWeight);
	for(let i=0;i<this.columns*this.rows;i++){
		let point=this.indexToCanvas(i);
		let size=this.cellWidth;
		if(i<16){
			fill(palette[i]);
		}else{
			noFill();
		}
		rect(point.x,point.y,size,size);
	}
	pop();
}

// 888             d8888 Y88b   d88P 8888888888 8888888b.
// 888            d88888  Y88b d88P  888        888   Y88b
// 888           d88P888   Y88o88P   888        888    888
// 888          d88P 888    Y888P    8888888    888   d88P
// 888         d88P  888     888     888        8888888P"
// 888        d88P   888     888     888        888 T88b
// 888       d8888888888     888     888        888  T88b
// 88888888 d88P     888     888     8888888888 888   T88b

function GuiLayer(x,y,width,height,columns,rows,block){
	Grid.call(this,x,y,width,height,columns,rows,block);
	this.selected=0;
}

GuiLayer.prototype=Object.create(Grid.prototype);
GuiLayer.prototype.constructor=GuiLayer;

GuiLayer.prototype.click=function(){
	if(this.contains(mouseX,mouseY)){
		let button=this.canvasToIndex(mouseX,mouseY);
		if(button<16){
			this.selected=button;
			gui.vertGroup.selected=0;
			gui.layerDrag=button;
			for(let i=0;i<16;i++){
				polys[i].deselectVerts();
			}
		}
	}
}

GuiLayer.prototype.release=function(){
	let button=this.canvasToIndex(mouseX,mouseY);
	if(button<16){
		let temp=polys[this.selected];
		polys.splice(this.selected,1);
		polys.splice(button,0,temp);
		this.selected=button;
		//gui.vertGroup.selected=0;
	}else if(button===16){
		polys[this.selected]=new Poly();
	}
}

GuiLayer.prototype.draw=function(){
	push();
	stroke(0);
	strokeWeight(gui.strokeWeight);
	for(let i=0;i<this.columns*this.rows;i++){
		let point=this.indexToCanvas(i);
		let size=this.cellWidth;
		if(i===16){
			noFill();
		}else if(polys[i].verts[0].length>0){
			fill(palette[7]);
		}else{
			fill(palette[5]);
		}
		rect(point.x,point.y,size,size);
		// textAlign(CENTER,CENTER);
		// fill(0);
		// textSize(24);
		// text('+',point.x+size*0.5,point.y+size*0.5);
		if(this.selected===i){
			noFill();
			let offset=this.cellWidth*0.25;
			let size=this.cellWidth*0.5;
			rect(point.x+offset,point.y+offset,size,size);
		}
	}
	let button=this.canvasToIndex(mouseX,mouseY);
	if(gui.layerDrag!==false){
		let point=this.indexToCanvas(button);
		let size=this.cellWidth;
		noFill();
		stroke(0);
		strokeWeight(gui.strokeWeight*3);
		rect(point.x,point.y,size,size);
	}
	pop();
}

//  .d8888b.  8888888b.   .d88888b.  888     888 8888888b.
// d88P  Y88b 888   Y88b d88P" "Y88b 888     888 888   Y88b
// 888    888 888    888 888     888 888     888 888    888
// 888        888   d88P 888     888 888     888 888   d88P
// 888  88888 8888888P"  888     888 888     888 8888888P"
// 888    888 888 T88b   888     888 888     888 888
// Y88b  d88P 888  T88b  Y88b. .d88P Y88b. .d88P 888
//  "Y8888P88 888   T88b  "Y88888P"   "Y88888P"  888

function GuiVertGroup(x,y,width,height,columns,rows,block){
	Grid.call(this,x,y,width,height,columns,rows,block);
	this.selected=0;
}

GuiVertGroup.prototype=Object.create(Grid.prototype);
GuiVertGroup.prototype.constructor=GuiVertGroup;

GuiVertGroup.prototype.click=function(){
	if(this.contains(mouseX,mouseY)){
		let button=this.canvasToIndex(mouseX,mouseY);
		let count=polys[gui.layer.selected].countVertGroups();
		if(button<=count){
			this.selected=button;
			for(let i=0;i<16;i++){
				polys[i].deselectVerts();
			}
		}
	}
}

GuiVertGroup.prototype.draw=function(){
	push();
	let count=polys[gui.layer.selected].countVertGroups();
	stroke(0);
	strokeWeight(gui.strokeWeight);
	for(let i=0;i<=count;i++){
		let point=this.indexToCanvas(i);
		let size=this.cellWidth;
		if(i<count){
			fill(palette[7]);
		}else{
			fill(palette[5]);
		}
		rect(point.x,point.y,size,size);
		if(this.selected===i){
			noFill();
			let offset=this.cellWidth*0.25;
			let size=this.cellWidth*0.5;
			rect(point.x+offset,point.y+offset,size,size);
		}
	}
	pop();
}

// 888     888 8888888888 8888888b. 88888888888      888888b.    .d88888b. Y88b   d88P
// 888     888 888        888   Y88b    888          888  "88b  d88P" "Y88b Y88b d88P
// 888     888 888        888    888    888          888  .88P  888     888  Y88o88P
// Y88b   d88P 8888888    888   d88P    888          8888888K.  888     888   Y888P
//  Y88b d88P  888        8888888P"     888          888  "Y88b 888     888   d888b
//   Y88o88P   888        888 T88b      888          888    888 888     888  d88888b
//    Y888P    888        888  T88b     888          888   d88P Y88b. .d88P d88P Y88b
//     Y8P     8888888888 888   T88b    888          8888888P"   "Y88888P" d88P   Y88b

function VertBox(x,y){
	Grid.call(this,x,y,0,0);
	// let point=gui.canvas.canvasToCell(x,y);
	this.xClick=x;
	this.yClick=y;
	// this.x1=point.x;
	// this.y1=point.y;
	// this.x2=point.x;
	// this.y2=point.y;
	// this.verts=[];
	// this.drag=true;
}

VertBox.prototype=Object.create(Grid.prototype);
VertBox.prototype.constructor=VertBox;

VertBox.prototype.drag=function(){
	let mx=constrain(mouseX,gui.canvas.x,gui.canvas.x+gui.canvas.width);
	let my=constrain(mouseY,gui.canvas.y,gui.canvas.y+gui.canvas.height);
	this.x=min(this.xClick,mx);
	this.y=min(this.yClick,my);
	this.width=abs(mx-this.xClick);
	this.height=abs(my-this.yClick);
}

// VertBox.prototype.getHitbox=function(){
// 	let point1=gui.canvas.cellToCanvas(this.x1,this.y1);
// 	let point2=gui.canvas.cellToCanvas(this.x2,this.y2);
// 	point2.x+=gui.canvas.cellWidth;
// 	point2.y+=gui.canvas.cellHeight;
// 	return new Grid(point1.x,point1.y,point2.x-point1.x,point2.y-point1.y);
// }

VertBox.prototype.release=function(){
	if(!keyIsDown(selectKey)&&!keyIsDown(deselectKey)){
		polys[gui.layer.selected].deselectVerts();
	}
	// let deleting=false;
	// if(keyIsDown(90)){
	// 	deleting=true;
	// }
	// let deselecting=false;
	// if(keyIsDown(ALT)){
	// 	deselecting=true;
	// }
	// let vertSelection=[];
	let verts=polys[gui.layer.selected].verts[gui.vertGroup.selected];
	for(let i=0;i<verts.length;i++){
		let hitbox=verts[i].getHitbox();
		let x=hitbox.x+hitbox.width*0.5;
		let y=hitbox.y+hitbox.height*0.5;
		if(this.contains(x,y)){
			// vertSelection.push(verts[i]);
			if(keyIsDown(deleteKey)){
				verts[i].delete=true;
			}else{
				if(keyIsDown(deselectKey)){
					verts[i].selected=false;
				}else{
					verts[i].selected=true;
				}
			}
		}
	}
	// return vertsWereSelected;
}

// VertBox.prototype.release=function(){
// 	if(!keyIsDown(SHIFT)&&!keyIsDown(ALT)){
// 		polys[gui.layer.selected].deselectVerts();
// 	}
// 	let deleting=false;
// 	if(keyIsDown(90)){
// 		deleting=true;
// 	}
// 	let deselecting=false;
// 	if(keyIsDown(ALT)){
// 		deselecting=true;
// 	}
// 	let vertsWereSelected=false;
// 	// let vertSelection=[];
// 	let verts=polys[gui.layer.selected].verts[gui.vertGroup.selected];
// 	for(let i=0;i<verts.length;i++){
// 		let hitbox=verts[i].getHitbox();
// 		let x=hitbox.x+hitbox.width*0.5;
// 		let y=hitbox.y+hitbox.height*0.5;
// 		if(this.contains(x,y)){
// 			// vertSelection.push(verts[i]);
// 			if(deleting){
// 				verts[i].delete=true;
// 			}else{
// 				if(deselecting){
// 					verts[i].selected=false;
// 				}else{
// 					verts[i].selected=true;
// 					vertsWereSelected=true;
// 				}
// 			}
// 		}
// 	}
// 	// return vertsWereSelected;
// }

VertBox.prototype.draw=function(){
	this.drag();
	push();
	// if(gui.vertBoxDrag){
	// 	this.drag();
	// }
	// let hitbox=this.getHitbox()
	fill(255,255,255,127);
	if(keyIsDown(deleteKey)){
		fill(255,0,77,127);
	}
	stroke(0);
	strokeWeight(gui.strokeWeight);
	rect(this.x,this.y,this.width,this.height);
	pop();
}

// 888     888 8888888888 8888888b. 88888888888      888b     d888 8888888888 888b    888 888     888
// 888     888 888        888   Y88b    888          8888b   d8888 888        8888b   888 888     888
// 888     888 888        888    888    888          88888b.d88888 888        88888b  888 888     888
// Y88b   d88P 8888888    888   d88P    888          888Y88888P888 8888888    888Y88b 888 888     888
//  Y88b d88P  888        8888888P"     888          888 Y888P 888 888        888 Y88b888 888     888
//   Y88o88P   888        888 T88b      888          888  Y8P  888 888        888  Y88888 888     888
//    Y888P    888        888  T88b     888          888   "   888 888        888   Y8888 Y88b. .d88P
//     Y8P     8888888888 888   T88b    888          888       888 8888888888 888    Y888  "Y88888P"

function VertMenu(vert){
	this.vert=vert;
}

VertMenu.prototype.getHitbox=function(){
	let button=gui.block;
	let point=gui.canvas.cellToCanvas(this.vert.x,this.vert.y);
	let offset=gui.canvas.cellWidth*0.5;
	point.x+=offset;
	point.y+=offset;
	return new Grid(point.x-button,point.y-button,button*2,button*2,2,2);
}

VertMenu.prototype.click=function(){
	let hitbox=this.getHitbox();
	if(hitbox.contains(mouseX,mouseY)){
		let button=hitbox.canvasToIndex(mouseX,mouseY);
		if(button===0){
			gui.vertDrag=this.vert;
		}else if(button===1){
			this.vert.color=!this.vert.color;
		}else if(button===2){
			this.vert.pin=!this.vert.pin;
		}else if(button===3){
			this.vert.delete=true;
			polys[gui.layer.selected].deleteVert();
		}
	}
	gui.vertMenu=false;
}

VertMenu.prototype.draw=function(){
	push();
	let hitbox=this.getHitbox();
	let size=hitbox.cellWidth;
	let labels=['Mov','Col','Pin','Del'];
	let offset=size*0.5;
	//textSize(floor(size*0.4));
	textSize(20);
	textAlign(CENTER,CENTER);
	for(let i=0;i<4;i++){
		fill(255);
		stroke(0);
		strokeWeight(3);
		let point=hitbox.indexToCanvas(i);
		rect(point.x,point.y,size,size);
		fill(0);
		noStroke();
		text(labels[i],point.x+offset,point.y+offset);
	}
	noFill();
	stroke(0);
	strokeWeight(9);
	if(hitbox.contains(mouseX,mouseY)){
		let button=hitbox.canvasToIndex(mouseX,mouseY);
		let point=hitbox.indexToCanvas(button);
		rect(point.x,point.y,size,size);
	}
	pop();
}

// function GuiInfo(x,y,width,height,columns,rows,block){
// 	Grid.call(this,x,y,width,height,columns,rows,block);
// 	this.selected=0;
// }
//
// GuiInfo.prototype=Object.create(Grid.prototype);
// GuiInfo.prototype.constructor=GuiInfo;
//
// GuiInfo.prototype.draw=function(){
//
// }

//  .d8888b.  8888888b.  8888888 8888888b.
// d88P  Y88b 888   Y88b   888   888  "Y88b
// 888    888 888    888   888   888    888
// 888        888   d88P   888   888    888
// 888  88888 8888888P"    888   888    888
// 888    888 888 T88b     888   888    888
// Y88b  d88P 888  T88b    888   888  .d88P
//  "Y8888P88 888   T88b 8888888 8888888P"

function Grid(x,y,width,height,columns=1,rows=1,block=1){
	this.x=x*block;
	this.y=y*block;
	this.width=width*block;
	this.height=height*block;
	this.columns=columns;
	this.rows=rows;
	this.cellWidth=this.width/columns;
	this.cellHeight=this.height/rows;
}

Grid.prototype.contains=function(x,y){
	return x>=this.x && x<=this.x+this.width && y>=this.y && y<=this.y+this.height;
}

Grid.prototype.collide=function(other){
	return this.x<=other.x+other.width && this.x+this.width>=other.x && this.y<=other.y+other.height && this.y+this.height>=other.y;
}

Grid.prototype.canvasToCell=function(x,y){
	x=constrain(floor((x-this.x)/this.cellWidth),0,this.columns-1);
	y=constrain(floor((y-this.y)/this.cellHeight),0,this.rows-1);
	return {x:x,y:y};
}

Grid.prototype.cellToIndex=function(x,y){
	return y*this.columns+x;
}

Grid.prototype.canvasToIndex=function(x,y){
	let cell=this.canvasToCell(x,y);
	return this.cellToIndex(cell.x,cell.y);
}

Grid.prototype.cellToCanvas=function(x,y){
	x=x*this.cellWidth+this.x;
	y=y*this.cellHeight+this.y;
	return {x:x,y:y};
}

Grid.prototype.indexToCell=function(index){
	let x=index%this.columns;
	let y=floor(index/this.columns);
	return {x:x,y:y};
}

Grid.prototype.indexToCanvas=function(index){
	let cell=this.indexToCell(index);
	return this.cellToCanvas(cell.x,cell.y);
}

// Grid.prototype.rectangle=function(strokeColor,fillColor,x1,y1,x2,y2){
// 	push();
// 	let topLeft=this.cellToCanvas(x1,y1);
// 	let bottomRight=this.cellToCanvas(x2+this.cellWidth,y2+this.cellHeight);
// 	strokeColor?stroke(strokeColor):noStroke();
// 	fillColor?fill(fillColor):noFill();
// 	rect(topLeft.x,topLeft.y,bottomRight.x-topLeft.x,bottomRight.y-topLeft.y);
// 	pop();
// }

// 888     888 8888888888 8888888b. 88888888888
// 888     888 888        888   Y88b    888
// 888     888 888        888    888    888
// Y88b   d88P 8888888    888   d88P    888
//  Y88b d88P  888        8888888P"     888
//   Y88o88P   888        888 T88b      888
//    Y888P    888        888  T88b     888
//     Y8P     8888888888 888   T88b    888

function Vert(x,y,pin=false,color=true){
	this.x=x;
	this.y=y;
	this.pin=pin;
	this.color=color;
	this.delete=false;
	this.selected=false;
}

Vert.prototype.click=function(){
	let hitbox=this.getHitbox();
	if(hitbox.contains(mouseX,mouseY)){
		// gui.vertMenu=new VertMenu(this);
		if(keyIsDown(SHIFT)){
			this.selected=true;
		}else if(keyIsDown(ALT)){
			this.selected=false;
		}else if(keyIsDown(90)){
			this.delete=true;
		}else{
			gui.vertClick=this;
		}
		return true;
	}else{
		return false;
	}
}

Vert.prototype.getHitbox=function(){
	let point=gui.canvas.cellToCanvas(this.x,this.y);
	let offset=gui.canvas.cellWidth;
	return new Grid(point.x-offset,point.y-offset,offset*3,offset*3);
}

// Vert.prototype.getRegion=function(){
// 	let x=map(this.x,0,127,0,1000);
// 	let y=map(this.y,0,127,0,1000);
// 	let width=pixel*2;
// 	let height=pixel*2;
// 	return new Region(x,y,width,height);
// }

Vert.prototype.move=function(x,y){
	let cell=gui.canvas.canvasToCell(x,y);
	this.x=cell.x;
	this.y=cell.y;
}

Vert.prototype.pack=function(){
	let x=this.pin?this.x+128:this.x;
	let y=this.color?this.y+128:this.y;
	x=x.toString(16).padStart(2,'0');
	y=y.toString(16).padStart(2,'0');
	return x+y;
}

Vert.prototype.unpack=function(string){
	//console.log(string);
	let x=parseInt(string.substring(0,2),16);
	let y=parseInt(string.substring(2),16);
	this.pin=x>127?true:false;
	this.color=y>127?true:false;
	this.x=x%128;
	this.y=y%128;
	return this;
	//console.log(this);
	//return new Vert(x,y,pin,color);
}

Vert.prototype.draw=function(){
	push();
	// let gui.strokeWeight=max(floor(gui.canvas.cellWidth/2),1);
	stroke(0);
	strokeWeight(gui.strokeWeight);
	rectMode(CENTER);
	let hitbox=this.getHitbox();
	let x=hitbox.x+hitbox.width*0.5;
	let y=hitbox.y+hitbox.height*0.5;
	fill(255);
	if(this.selected){
		fill(palette[12]);
	}
	if(this.pin){
		rect(x,y,hitbox.width,hitbox.height);
	}else{
		ellipse(x,y,hitbox.width);
	}
	if(hitbox.contains(mouseX,mouseY) && gui.canvas.contains(mouseX,mouseY)){
		// if(keyIsDown(selectKey)){
		// 	this.selected=true;
		// }else if(keyIsDown(deselectKey)){
		// 	this.selected=false;
		// }else if(keyIsDown(deleteKey)){
		// 	this.delete=true;
		// }
		noFill();
		stroke(0);
		strokeWeight(gui.strokeWeight*3);
		ellipse(x,y,hitbox.width*3);
		stroke(255);
		strokeWeight(gui.strokeWeight);
		ellipse(x,y,hitbox.width*3);
	}
	pop();
}

// 888b     d888 8888888 8888888b.  8888888b.   .d88888b. 8888888 888b    888 88888888888
// 8888b   d8888   888   888  "Y88b 888   Y88b d88P" "Y88b  888   8888b   888     888
// 88888b.d88888   888   888    888 888    888 888     888  888   88888b  888     888
// 888Y88888P888   888   888    888 888   d88P 888     888  888   888Y88b 888     888
// 888 Y888P 888   888   888    888 8888888P"  888     888  888   888 Y88b888     888
// 888  Y8P  888   888   888    888 888        888     888  888   888  Y88888     888
// 888   "   888   888   888  .d88P 888        Y88b. .d88P  888   888   Y8888     888
// 888       888 8888888 8888888P"  888         "Y88888P" 8888888 888    Y888     888

function Midpoint(a,b,index){
	this.x=round(a.x*0.5+b.x*0.5);
	this.y=round(a.y*0.5+b.y*0.5);
	this.index=index;
	this.vert=a;
}

Midpoint.prototype.getHitbox=function(){
	let point=gui.canvas.cellToCanvas(this.x,this.y);
	let pixel=gui.canvas.cellWidth;
	return new Grid(point.x-pixel,point.y-pixel,pixel*3,pixel*3);
}

Midpoint.prototype.click=function(verts){
	let hitbox=this.getHitbox();
	if(hitbox.contains(mouseX,mouseY)){
		// gui.vertMenu=new VertMenu(this);
		gui.midpointClick=this;
		return true;
	}else{
		return false;
	}

	hitbox=this.getHitbox();
	if(hitbox.contains(mouseX,mouseY)){
		verts.splice(this.index,0,new Vert(this.x,this.y));
		return true;
	}else{
		return false;
	}
}

Midpoint.prototype.draw=function(){
	push();
	fill(0);
	if(!this.vert.color){
		fill(palette[8]);
	}
	// let gui.strokeWeight=max(floor(gui.canvas.cellWidth/2),1);
	stroke(255);
	strokeWeight(gui.strokeWeight);
	let hitbox=this.getHitbox();
	let x=hitbox.x+hitbox.width*0.5;
	let y=hitbox.y+hitbox.height*0.5;
	ellipse(x,y,hitbox.width);
	if(hitbox.contains(mouseX,mouseY) && gui.canvas.contains(mouseX,mouseY)){
		noFill();
		stroke(0);
		strokeWeight(gui.strokeWeight*3);
		ellipse(x,y,hitbox.width*3);
		stroke(255);
		strokeWeight(gui.strokeWeight);
		ellipse(x,y,hitbox.width*3);
	}
	pop();
}

// 8888888b.   .d88888b.  888    Y88b   d88P
// 888   Y88b d88P" "Y88b 888     Y88b d88P
// 888    888 888     888 888      Y88o88P
// 888   d88P 888     888 888       Y888P
// 8888888P"  888     888 888        888
// 888        888     888 888        888
// 888        Y88b. .d88P 888        888
// 888         "Y88888P"  88888888   888

function Poly(){
	this.fillColor=7;
	this.lineColor=0;
	this.verts=[];
	this.midpoints=[];
	this.canvas=createGraphics(128,128);
	for(let i=0;i<16;i++){
		this.verts.push([]);
	}
}

Poly.prototype.addVertex=function(x,y){
	this.verts[gui.vertGroup.selected].push(new Vert(x,y));
}

Poly.prototype.getMidpoints=function(){
	this.midpoints=[];
	let verts=this.verts[gui.vertGroup.selected];
	for(let i=1;i<verts.length;i++){
		let a=verts[i-1];
		let b=verts[i];
		//if(a.color){
			this.midpoints.push(new Midpoint(a,b,i));
		//}
	}
}

Poly.prototype.countVertGroups=function(){
	for(let i=0;i<16;i++){
		if(this.verts[i].length===0){
			return i;
		}
	}
	return 16;
}

Poly.prototype.click=function(){
	let verts=this.verts[gui.vertGroup.selected];
	for(let i=0;i<verts.length;i++){
		if(verts[i].click()){
			return true;
		}
	}
	for(let i=0;i<this.midpoints.length;i++){
		if(this.midpoints[i].click(verts,i+1)){
			return true;
		}
	}
	// this.deselectVerts();
	return false;
}

// Poly.prototype.select=function(vertBox){
// 	let verts=this.verts[gui.vertGroup.selected];
// 	// let selection=[];
// 	for(let i=0;i<verts.length;i++){
// 		let point=gui.canvas.cellToCanvas(verts[i].x,verts[i].y);
// 		point.x+=gui.canvas.cellWidth;
// 		point.y+=gui.canvas.cellHeight;
// 		if(vertBox.contains(point.x,point.y)){
// 			selection.push(verts[i]);
// 			verts[i].selected=true;
// 		}
// 	}
// 	// return selection;
// }

// Poly.prototype.deselect=function(){
// 	if(gui.canvas.selected){
// 		let verts=this.verts[gui.vertGroup.selected];
// 		for(let i=0;i<verts.length;i++){
// 			verts[i].selected=false;
// 		}
// 		gui.canvas.selected=false;
// 	}
// }

Poly.prototype.selectVerts=function(){
	let verts=this.verts[gui.vertGroup.selected];
	for(let i=0;i<verts.length;i++){
		verts[i].selected=true;
	}
}

Poly.prototype.deselectVerts=function(){
	let verts=this.verts[gui.vertGroup.selected];
	for(let i=0;i<verts.length;i++){
		verts[i].selected=false;
	}
}

Poly.prototype.moveVerts=function(vert){
	let xMin=127;
	let yMin=127;
	let xMax=0;
	let yMax=0;
	let verts=this.verts[gui.vertGroup.selected];
	for(let i=0;i<verts.length;i++){
		if(verts[i].selected){
			xMin=verts[i].x<xMin?verts[i].x:xMin;
			yMin=verts[i].y<yMin?verts[i].y:yMin;
			xMax=verts[i].x>xMax?verts[i].x:xMax;
			yMax=verts[i].y>yMax?verts[i].y:yMax;
		}
	}
	let point=gui.canvas.canvasToCell(mouseX,mouseY);
	let dx=constrain(point.x-vert.x,-xMin,127-xMax);
	let dy=constrain(point.y-vert.y,-yMin,127-yMax);
	for(let i=0;i<verts.length;i++){
		if(verts[i].selected){
			verts[i].x+=dx;
			verts[i].y+=dy;
		}
	}
}

Poly.prototype.deleteVert=function(){
	let verts=this.verts[gui.vertGroup.selected];
	for(let i=0;i<verts.length;i++){
		if(verts[i].delete){
			verts.splice(i,1);
		}
	}
	if(verts.length===0){
		this.verts.splice(gui.vertGroup.selected,1);
		this.verts.push([]);
	}
}

Poly.prototype.subdivide=function(verts,subdivisions,splitColor){
	let newVerts=[];
	for(let i=0;i<verts.length;i++){
		newVerts[i]=[];
		for(let k=1;k<verts[i].length;k++){
			let a=verts[i][k-1];
			let b=verts[i][k];
		  let result=subdivide(a,b,splitColor);
      newVerts[i].push(result[0],result[1]);
    }
    newVerts[i].push(newVerts[i][0]);
  }
  if(subdivisions>1){
    newVerts=this.subdivide(newVerts,subdivisions-1,true);
  }
  return newVerts;
}

Poly.prototype.fill=function(verts){
  let endpoints=[];
  for(let i=0;i<verts.length;i++){
    for(let k=1;k<verts[i].length;k++){
      let a=verts[i][k-1];
			let b=verts[i][k];
      let deltaX=b.x-a.x;
      let deltaY=b.y-a.y;
      let xSign=deltaX>0?1:-1;
      let ySign=deltaY>0?1:-1;
      deltaX=abs(deltaX);
      deltaY=abs(deltaY);
      let slope=deltaX/deltaY;
      if(deltaY!==0){
        let low=a.y<b.y?a:b;
        if(!endpoints[low.y]){
          endpoints[low.y]=[low.x];
        }else{
          sortInsert(endpoints[low.y],low.x);
        }
        for(let m=1;m<deltaY;m++){
          let x=m*slope;
          x=round(x*xSign)+a.x;
          let y=m*ySign+a.y;
          if(!endpoints[y]){
            endpoints[y]=[x];
          }else{
            sortInsert(endpoints[y],x);
          }
        }
      }
    }
  }
	this.canvas.push();
	this.canvas.fill(palette[this.fillColor]);
	this.canvas.noStroke();
	for(let y=0;y<128;y++){
		if(endpoints[y]){
			let x=endpoints[y];
	    for(let i=1;i<x.length;i+=2){
				this.canvas.rect(x[i-1],y,x[i]-x[i-1],1);
			}
		}
  }
	this.canvas.pop();
}

Poly.prototype.line=function(verts){
	this.canvas.push();
	this.canvas.noStroke();
	for(let i=0;i<verts.length;i++){
		for(let k=1;k<verts[i].length;k++){
			let a=verts[i][k-1];
			let b=verts[i][k];
			let points=bresenham(a,b);
			let color=a.color?this.lineColor:this.fillColor;
			// let colorB=b.color?this.lineColor:this.fillColor;
			// let half=ceil(points.length/2);
			if(color<16){
				this.canvas.fill(palette[color]);
				for(let p=0;p<points.length;p++){
					this.canvas.rect(points[p].x,points[p].y,1,1);
				}
			}
			// if(colorB<16){
			// 	this.canvas.fill(palette[colorB]);
			// 	for(let p=half;p<points.length;p++){
			// 		this.canvas.rect(points[p].x,points[p].y,1,1);
			// 	}
			// }
		}
	}
	this.canvas.pop();
}

Poly.prototype.pack=function(){
	let count=this.countVertGroups();
	let fillColor=this.fillColor<16?this.fillColor.toString(16):'x';
	let lineColor=this.lineColor.toString(16);
	let string=fillColor+lineColor;
	if(count>0){
		for(let i=0;i<count;i++){
			for(let k=0;k<this.verts[i].length;k++){
				string=string+this.verts[i][k].pack();
			}
			string=string+'g';
		}
		string=string.slice(0,-1)+'p';
		return string;
	}
	return '';
}

Poly.prototype.unpack=function(string){
	//console.log(string);
	let fillColor=string.charAt(0);
	this.fillColor=fillColor==='x'?16:parseInt(fillColor,16);
	this.lineColor=parseInt(string.charAt(1),16);
	let groups=[];
	let startIndex=2;
	for(let i=2;i<string.length;i++){
		if(string.charAt(i)==='g'){
			groups.push(string.substring(startIndex,i));
			startIndex=i+1;
		}
	}
	groups.push(string.substring(startIndex));
	for(let i=0;i<groups.length;i++){
		//console.log(groups[i]);
		for(let k=0;k<groups[i].length;k+=4){
			let s=groups[i].substring(k,k+4);
			let vert=new Vert(0,0);
			this.verts[i].push(vert.unpack(s));
		}
	}
}

// Poly.prototype.render=function(){
// 	this.canvas.clear();
// 	fillPolygon(this.canvas,this.verts[0],this.fillColor);
// }

Poly.prototype.draw=function(){
	//let group=this.verts[gui.vertGroup.selected];
	this.deleteVert();
	if(gui.vertClick){
		let hitbox=gui.vertClick.getHitbox();
		if(!hitbox.contains(mouseX,mouseY)){
			gui.vertDrag=gui.vertClick;
			gui.vertClick=false;
		}
	}
	if(gui.midpointClick){
		let midpoint=gui.midpointClick;
		let hitbox=midpoint.getHitbox();
		if(!hitbox.contains(mouseX,mouseY)){
			let verts=this.verts[gui.vertGroup.selected];
			let vert=new Vert(midpoint.x,midpoint.y,false,midpoint.vert.color);
			verts.splice(midpoint.index,0,vert);
			gui.midpointClick=false;
			gui.vertDrag=vert;
		}
	}
	if(gui.vertDrag){
		if(gui.vertDrag.selected){
			this.moveVerts(gui.vertDrag);
		}else{
			gui.vertDrag.move(mouseX,mouseY);
		}
	}
	let count=this.countVertGroups();
	if(count>0){
		push();
		for(let i=0;i<count;i++){
			this.verts[i].push(this.verts[i][0]);
		}
		//group.push(group[0]);
		let verts=this.subdivide(this.verts,2,false);
		this.canvas.clear();
		if(this.fillColor<16){
			this.fill(verts);
		}
		this.line(verts);
		// noSmooth();
		// image(this.canvas,gui.canvas.x,gui.canvas.y,gui.canvas.width,gui.canvas.height);
		verts=this.verts[gui.vertGroup.selected];
		if(gui.showEdges){
			for(let i=1;i<verts.length;i++){
				let a=verts[i-1];
				let b=verts[i];
				a=gui.canvas.cellToCanvas(a.x,a.y);
				b=gui.canvas.cellToCanvas(b.x,b.y);
				let offset=gui.canvas.cellWidth*0.5;
				a.x+=offset;
				a.y+=offset;
				b.x+=offset;
				b.y+=offset;
				// let gui.strokeWeight=max(floor(gui.canvas.cellWidth/2),1);
				stroke(0);
				strokeWeight(gui.strokeWeight*3);
				line(a.x,a.y,b.x,b.y);
				stroke(255);
				strokeWeight(gui.strokeWeight);
				line(a.x,a.y,b.x,b.y);
			}
		}
		this.getMidpoints();
		for(let i=0;i<this.midpoints.length;i++){
			this.midpoints[i].draw();
		}
		for(let i=0;i<verts.length;i++){
			verts[i].draw();
		}
		for(let i=0;i<count;i++){
			this.verts[i].pop();
		}
		pop();
	}
}

// 8888888b.     d8888  .d8888b.  888    d8P
// 888   Y88b   d88888 d88P  Y88b 888   d8P
// 888    888  d88P888 888    888 888  d8P
// 888   d88P d88P 888 888        888d88K
// 8888888P" d88P  888 888        8888888b
// 888      d88P   888 888    888 888  Y88b
// 888     d8888888888 Y88b  d88P 888   Y88b
// 888    d88P     888  "Y8888P"  888    Y88b

function pack(){
	let string='';
	for(let i=0;i<16;i++){
		string=string+polys[i].pack();
	}
	return string;
}

function unpack(string){
	if(string.match(/[^0123456789abcdefgpx]/)){
		return 'Invalid string';
	}else{
		for(let i=0;i<16;i++){
			polys[i]=new Poly();
		}
		let polyIndex=0;
		let startIndex=0;
		for(let i=0;i<string.length;i++){
			if(string.charAt(i)==='p'){
				polys[polyIndex].unpack(string.substring(startIndex,i));
				startIndex=i+1;
				polyIndex++;
			}
		}
		for(let i=0;i<16;i++){
			polys[i].draw();
		}
		return '';
	}
}

// 888b     d888 8888888 .d8888b.   .d8888b.
// 8888b   d8888   888  d88P  Y88b d88P  Y88b
// 88888b.d88888   888  Y88b.      888    888
// 888Y88888P888   888   "Y888b.   888
// 888 Y888P 888   888      "Y88b. 888
// 888  Y8P  888   888        "888 888    888
// 888   "   888   888  Y88b  d88P Y88b  d88P
// 888       888 8888888 "Y8888P"   "Y8888P"

function createSquarePoly(poly){
	poly.addVertex(31,31);
	poly.addVertex(63,31);
	poly.addVertex(31,63);
	poly.addVertex(63,63);
}

function sortInsert(arr,val){
	let index=arr.length;
	for(let i=arr.length-1;i>=0 && val<arr[i];i--){
		arr[i+1]=arr[i];
		index=i;
	}
	arr[index]=val;
	return arr;
}

function bresenham(a,b){
	let points=[];
  let deltaX=b.x-a.x;
  let deltaY=b.y-a.y;
  let xSign=deltaX>0?1:-1;
  let ySign=deltaY>0?1:-1;
  deltaX=abs(deltaX);
  deltaY=abs(deltaY);
	if(deltaY<deltaX){
		let slope=deltaY/deltaX;
	  for(let m=0;m<deltaX;m++){
	    let y=m*slope;
	    y=round(y*ySign)+a.y;
	    let x=m*xSign+a.x;
			points.push({x:x,y:y});
		}
	}else{
	  let slope=deltaX/deltaY;
	  for(let m=0;m<deltaY;m++){
	    let x=m*slope;
	    x=round(x*xSign)+a.x;
	    let y=m*ySign+a.y;
			points.push({x:x,y:y});
		}
	}
	return points;
}

// Chaikin's Algorithm
function subdivide(a,b,splitColor){
	let result=[];
  if(!a.pin){
    let x=round(a.x*0.75+b.x*0.25);
    let y=round(a.y*0.75+b.y*0.25);
		result.push(new Vert(x,y,false,a.color));
  }else{
		result.push(a);
	}
  if(!b.pin){
    let x=round(a.x*0.25+b.x*0.75);
    let y=round(a.y*0.25+b.y*0.75);
		let color=splitColor?b.color:a.color;
		result.push(new Vert(x,y,false,color));
  }else{
  	result.push(b);
  }
  return result;
}

function magnitude(x1, y1, x2, y2) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	return sqrt(dx * dx + dy * dy);
}

function keyPressed(){
	if(keyCode===edgesKey){
		gui.showEdges=!gui.showEdges;
	}
	if(keyCode===transparencyKey){
		gui.transparency=!gui.transparency;
	}
	if(keyCode===selectAllKey){
		polys[gui.layer.selected].selectVerts();
	}
	if(keyCode===deselectAllKey){
		polys[gui.layer.selected].deselectVerts();
	}
	if(keyCode===ENTER){
		unpack(unpackInput.value());
		unpackInput.value('');
	}
}

function mousePressed() {
	gui.click();
}

function mouseReleased(){
	gui.release();
}
