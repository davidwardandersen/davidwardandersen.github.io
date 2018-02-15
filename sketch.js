//Vector editor for PICO-8 by David Ward Andersen
//https://github.com/davidwardandersen

var palette=[
	[0,0,0,255],[29,43,83,255],[126,37,83,255],[0,135,81,255],
	[171,82,54,255],[95,87,79,255],[194,195,199,255],[255,241,232,255],
	[255,0,77,255],[255,163,0,255],[255,240,36,255],[0,231,86,255],
	[41,173,255,255],[131,118,156,255],[255,119,168,255],[255,204,170,255]
];

var testString='d230c339dd50c4p22209816b0a1c938acg4d9b609a6db0dcc9p7631b35ab459cb2bccp77a59adc9ad2b1a8b1p003f9f4b9f4aae42b1g2c9d2cb034af359ep7745a448a74aa1g2fa431a833a4pc1239227ad20bc5dc064903e80gc1ae459dd79d51acgb4ae329ea79d29aepx1b2b336b7bf34p7654965f80fd816f93pe23e8f2da191ab9e92138e938326873e805a87699fe1b24c9fpe252032988b4a6pxdc9b8c330d0b7c930p';
var refImage;
var gui={};
var polys=[];
var packInput;
var unpackInput;
var loadButton;
//var vertMenu=false;
//var dragging=false;

function setup() {
	var c=createCanvas(1000,1000);
	c.drop(gotFile);
	for(var i=0;i<16;i++){
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
	gui.fill=new GuiColor(1,18,17,1,17,1,gui.block);
	gui.line=new GuiColor(1,19,16,1,16,1,gui.block);
	gui.layer=new GuiLayer(18,1,1,17,1,17,gui.block);
	gui.vertGroup=new GuiVertGroup(19,1,1,16,1,16,gui.block);
	gui.vertMenu=false;
	gui.vertDrag=false;
	gui.layerDrag=false;
	gui.showEdges=true;
	packInput=createInput('');
	packInput.position(gui.block*7,gui.block*20+gui.block*0.25);
	packInput.size(gui.block*10,gui.block*0.5);
	unpackInput=createInput('');
	unpackInput.position(gui.block*7,gui.block*21+gui.block*0.25);
	unpackInput.size(gui.block*10,gui.block*0.5);
	// loadButton=createButton('load');
	// loadButton.position(gui.block*18,gui.block*21+gui.block*0.25);
	// loadButton.size(gui.block*2,gui.block*0.5);
	// loadButton.input();
	gui.click=function(){
		if(gui.vertMenu){
			gui.vertMenu.click();
		}else{
			gui.canvas.click();
			gui.fill.click('fill');
			gui.line.click('line');
			gui.layer.click();
			gui.vertGroup.click();
		}
	}
	gui.release=function(){
		if(gui.vertDrag){
			gui.vertDrag=false;
		}else if(gui.layerDrag!==false){
			gui.layer.release();
		}
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
		textSize(24);
		textAlign(LEFT,CENTER);
		var string=pack();
		text('String length: '+string.length,gui.block*1,gui.block*21);
		packInput.value(string);
	}
}

// function windowResized(){
// 	setupGui();
// 	resizeCanvas(windowWidth,windowHeight);
// }

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
}

GuiCanvas.prototype=Object.create(Grid.prototype);
GuiCanvas.prototype.constructor=GuiCanvas;

GuiCanvas.prototype.click=function(){
	if(this.contains(mouseX,mouseY)){
		polys[gui.layer.selected].click();
	}
}

GuiCanvas.prototype.draw=function(){
	push();
	if(refImage){
		noSmooth();
		image(refImage,this.x,this.y,this.width,this.height);
		fill(127,127);
		rect(this.x,this.y,this.width,this.height);
	}
	noFill();
	stroke(0);
	strokeWeight(3);
	rect(this.x,this.y,this.width,this.height);
	noSmooth();
	for(var i=0;i<16;i++){
		image(polys[i].canvas,this.x,this.y,this.width,this.height);
	}
	polys[gui.layer.selected].draw();
	pop();
}

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
		var button=this.canvasToIndex(mouseX,mouseY);
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
	strokeWeight(3);
	for(var i=0;i<this.columns*this.rows;i++){
		var point=this.indexToCanvas(i);
		var size=this.cellWidth;
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
		var button=this.canvasToIndex(mouseX,mouseY);
		if(button<16){
			this.selected=button;
			gui.vertGroup.selected=0;
			gui.layerDrag=button;
		}
	}
}

GuiLayer.prototype.release=function(){
	var button=this.canvasToIndex(mouseX,mouseY);
	if(button<16){
		var temp=polys[this.selected];
		polys.splice(this.selected,1);
		polys.splice(button,0,temp);
		this.selected=button;
		//gui.vertGroup.selected=0;
	}else if(button===16){
		polys[this.selected]=new Poly();
	}
	gui.layerDrag=false;
}

GuiLayer.prototype.draw=function(){
	push();
	stroke(0);
	strokeWeight(3);
	for(var i=0;i<this.columns*this.rows;i++){
		var point=this.indexToCanvas(i);
		var size=this.cellWidth;
		if(i===16){
			noFill();
		}else if(polys[i].verts[0].length>0){
			fill(palette[7]);
		}else{
			fill(palette[5]);
		}
		rect(point.x,point.y,size,size);
		if(this.selected===i){
			noFill();
			var offset=this.cellWidth*0.25;
			var size=this.cellWidth*0.5;
			rect(point.x+offset,point.y+offset,size,size);
		}
	}
	var button=this.canvasToIndex(mouseX,mouseY);
	if(gui.layerDrag!==false){
		var point=this.indexToCanvas(button);
		var size=this.cellWidth;
		noFill();
		stroke(0);
		strokeWeight(9);
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
		var button=this.canvasToIndex(mouseX,mouseY);
		var count=polys[gui.layer.selected].countVertGroups();
		if(button<=count){
			this.selected=button;
		}
	}
}

GuiVertGroup.prototype.draw=function(){
	push();
	var count=polys[gui.layer.selected].countVertGroups();
	stroke(0);
	strokeWeight(3);
	for(var i=0;i<=count;i++){
		var point=this.indexToCanvas(i);
		var size=this.cellWidth;
		if(i<count){
			fill(palette[7]);
		}else{
			fill(palette[5]);
		}
		rect(point.x,point.y,size,size);
		if(this.selected===i){
			noFill();
			var offset=this.cellWidth*0.25;
			var size=this.cellWidth*0.5;
			rect(point.x+offset,point.y+offset,size,size);
		}
	}
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
	var button=gui.block;
	var point=gui.canvas.cellToCanvas(this.vert.x,this.vert.y);
	var offset=gui.canvas.cellWidth*0.5;
	point.x+=offset;
	point.y+=offset;
	return new Grid(point.x-button,point.y-button,button*2,button*2,2,2);
}

VertMenu.prototype.click=function(){
	var hitbox=this.getHitbox();
	if(hitbox.contains(mouseX,mouseY)){
		var button=hitbox.canvasToIndex(mouseX,mouseY);
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
	var hitbox=this.getHitbox();
	var size=hitbox.cellWidth;
	var labels=['Mov','Col','Pin','Del'];
	var offset=size*0.5;
	//textSize(floor(size*0.4));
	textSize(20);
	textAlign(CENTER,CENTER);
	for(var i=0;i<4;i++){
		fill(255);
		stroke(0);
		strokeWeight(3);
		var point=hitbox.indexToCanvas(i);
		rect(point.x,point.y,size,size);
		fill(0);
		noStroke();
		text(labels[i],point.x+offset,point.y+offset);
	}
	noFill();
	stroke(0);
	strokeWeight(9);
	if(hitbox.contains(mouseX,mouseY)){
		var button=hitbox.canvasToIndex(mouseX,mouseY);
		var point=hitbox.indexToCanvas(button);
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

Grid.prototype.canvasToCell=function(x,y){
	x=constrain(floor((x-this.x)/this.cellWidth),0,this.columns-1);
	y=constrain(floor((y-this.y)/this.cellHeight),0,this.rows-1);
	return {x:x,y:y};
}

Grid.prototype.cellToIndex=function(x,y){
	return y*this.columns+x;
}

Grid.prototype.canvasToIndex=function(x,y){
	var cell=this.canvasToCell(x,y);
	return this.cellToIndex(cell.x,cell.y);
}

Grid.prototype.cellToCanvas=function(x,y){
	x=x*this.cellWidth+this.x;
	y=y*this.cellHeight+this.y;
	return {x:x,y:y};
}

Grid.prototype.indexToCell=function(index){
	var x=index%this.columns;
	var y=floor(index/this.columns);
	return {x:x,y:y};
}

Grid.prototype.indexToCanvas=function(index){
	var cell=this.indexToCell(index);
	return this.cellToCanvas(cell.x,cell.y);
}

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
}

Vert.prototype.click=function(){
	var hitbox=this.getHitbox();
	if(hitbox.contains(mouseX,mouseY)){
		gui.vertMenu=new VertMenu(this);
		return true;
	}else{
		return false;
	}
}

Vert.prototype.getHitbox=function(){
	var point=gui.canvas.cellToCanvas(this.x,this.y);
	var offset=gui.canvas.cellWidth;
	return new Grid(point.x-offset,point.y-offset,offset*3,offset*3);
}

// Vert.prototype.getRegion=function(){
// 	var x=map(this.x,0,127,0,1000);
// 	var y=map(this.y,0,127,0,1000);
// 	var width=pixel*2;
// 	var height=pixel*2;
// 	return new Region(x,y,width,height);
// }

Vert.prototype.move=function(x,y){
	var cell=gui.canvas.canvasToCell(x,y);
	this.x=cell.x;
	this.y=cell.y;
}

Vert.prototype.pack=function(){
	var x=this.pin?this.x+128:this.x;
	var y=this.color?this.y+128:this.y;
	x=x.toString(16).padStart(2,'0');
	y=y.toString(16).padStart(2,'0');
	return x+y;
}

Vert.prototype.unpack=function(string){
	//console.log(string);
	var x=parseInt(string.substring(0,2),16);
	var y=parseInt(string.substring(2),16);
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
	stroke(0);
	strokeWeight(3);
	rectMode(CENTER);
	var hitbox=this.getHitbox();
	var x=hitbox.x+hitbox.width*0.5;
	var y=hitbox.y+hitbox.height*0.5;
	fill(255);
	if(!this.color){
		fill(palette[8]);
	}
	if(this.pin){
		rect(x,y,hitbox.width,hitbox.height);
	}else{
		ellipse(x,y,hitbox.width);
	}
	if(hitbox.contains(mouseX,mouseY) && gui.canvas.contains(mouseX,mouseY)){
		noFill();
		stroke(0);
		strokeWeight(9);
		ellipse(x,y,hitbox.width*3);
		stroke(255);
		strokeWeight(3);
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
}

Midpoint.prototype.getHitbox=function(){
	var point=gui.canvas.cellToCanvas(this.x,this.y);
	var pixel=gui.canvas.cellWidth;
	return new Grid(point.x-pixel,point.y-pixel,pixel*3,pixel*3);
}

Midpoint.prototype.click=function(verts){
	var hitbox=this.getHitbox();
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
	stroke(255);
	strokeWeight(3);
	var hitbox=this.getHitbox();
	var x=hitbox.x+hitbox.width*0.5;
	var y=hitbox.y+hitbox.height*0.5;
	ellipse(x,y,hitbox.width);
	if(hitbox.contains(mouseX,mouseY) && gui.canvas.contains(mouseX,mouseY)){
		noFill();
		stroke(0);
		strokeWeight(9);
		ellipse(x,y,hitbox.width*3);
		stroke(255);
		strokeWeight(3);
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
	for(var i=0;i<16;i++){
		this.verts.push([]);
	}
}

Poly.prototype.addVertex=function(x,y){
	this.verts[gui.vertGroup.selected].push(new Vert(x,y));
}

Poly.prototype.getMidpoints=function(){
	this.midpoints=[];
	var verts=this.verts[gui.vertGroup.selected];
	for(var i=1;i<verts.length;i++){
		var a=verts[i-1];
		var b=verts[i];
		if(a.color){
			this.midpoints.push(new Midpoint(a,b,i));
		}
	}
}

Poly.prototype.countVertGroups=function(){
	for(var i=0;i<16;i++){
		if(this.verts[i].length===0){
			return i;
		}
	}
	return 16;
}

Poly.prototype.click=function(){
	var verts=this.verts[gui.vertGroup.selected];
	for(var i=0;i<verts.length;i++){
		if(verts[i].click()){
			return;
		}
	}
	for(var i=0;i<this.midpoints.length;i++){
		if(this.midpoints[i].click(verts,i+1)){
			return;
		}
	}
	var cell=gui.canvas.canvasToCell(mouseX,mouseY);
	// var x=floor(map(mouseX,0,1000,0,127));
	// var y=floor(map(mouseY,0,1000,0,127));
	this.addVertex(cell.x,cell.y);
}

Poly.prototype.deleteVert=function(){
	var verts=this.verts[gui.vertGroup.selected];
	for(var i=0;i<verts.length;i++){
		if(verts[i].delete){
			verts.splice(i,1);
		}
	}
	if(verts.length===0){
		this.verts.splice(gui.vertGroup.selected,1);
		this.verts.push([]);
	}
}

Poly.prototype.subdivide=function(verts,subdivisions){
	var newVerts=[];
	for(var i=0;i<verts.length;i++){
		newVerts[i]=[];
		for(var k=1;k<verts[i].length;k++){
			var a=verts[i][k-1];
			var b=verts[i][k];
		  var result=subdivide(a,b);
      newVerts[i].push(result[0],result[1]);
    }
    newVerts[i].push(newVerts[i][0]);
  }
  if(subdivisions>1){
    newVerts=this.subdivide(newVerts,subdivisions-1);
  }
  return newVerts;
}

Poly.prototype.fill=function(verts){
  var endpoints=[];
  for(var i=0;i<verts.length;i++){
    for(var k=1;k<verts[i].length;k++){
      var a=verts[i][k-1];
			var b=verts[i][k];
      var deltaX=b.x-a.x;
      var deltaY=b.y-a.y;
      var xSign=deltaX>0?1:-1;
      var ySign=deltaY>0?1:-1;
      deltaX=abs(deltaX);
      deltaY=abs(deltaY);
      var slope=deltaX/deltaY;
      if(deltaY!==0){
        var low=a.y<b.y?a:b;
        if(!endpoints[low.y]){
          endpoints[low.y]=[low.x];
        }else{
          sortInsert(endpoints[low.y],low.x);
        }
        for(var m=1;m<deltaY;m++){
          var x=m*slope;
          x=round(x*xSign)+a.x;
          var y=m*ySign+a.y;
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
	for(var y=0;y<128;y++){
		if(endpoints[y]){
			var x=endpoints[y];
	    for(var i=1;i<x.length;i+=2){
				this.canvas.rect(x[i-1],y,x[i]-x[i-1],1);
			}
		}
  }
	this.canvas.pop();
}

Poly.prototype.line=function(verts){
	this.canvas.push();
	this.canvas.noStroke();
	for(var i=0;i<verts.length;i++){
		for(var k=1;k<verts[i].length;k++){
			var a=verts[i][k-1];
			var b=verts[i][k];
			var points=bresenham(a,b);
			var color=a.color?this.lineColor:this.fillColor;
			// var colorA=a.color?this.lineColor:this.fillColor;
			// var colorB=b.color?this.lineColor:this.fillColor;
			// if(!a.color){
			// 	color=this.fillColor;
			// }
			// var half=points.length/2;
			// half-=half%2;
			if(color<16){
				this.canvas.fill(palette[color]);
				for(var p=0;p<points.length;p+=2){
					this.canvas.rect(points[p],points[p+1],1,1);
				}
			}
			// if(colorB<16){
			// 	this.canvas.fill(palette[colorB]);
			// 	for(var p=half;p<points.length;p+=2){
			// 		this.canvas.rect(points[p],points[p+1],1,1);
			// 	}
			// }
		}
	}
	this.canvas.pop();
}

Poly.prototype.pack=function(){
	var count=this.countVertGroups();
	var fillColor=this.fillColor<16?this.fillColor.toString(16):'x';
	var lineColor=this.lineColor.toString(16);
	var string=fillColor+lineColor;
	if(count>0){
		for(var i=0;i<count;i++){
			for(var k=0;k<this.verts[i].length;k++){
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
	var fillColor=string.charAt(0);
	this.fillColor=fillColor==='x'?16:parseInt(fillColor,16);
	this.lineColor=parseInt(string.charAt(1),16);
	var groups=[];
	var startIndex=2;
	for(var i=2;i<string.length;i++){
		if(string.charAt(i)==='g'){
			groups.push(string.substring(startIndex,i));
			startIndex=i+1;
		}
	}
	groups.push(string.substring(startIndex));
	for(var i=0;i<groups.length;i++){
		//console.log(groups[i]);
		for(var k=0;k<groups[i].length;k+=4){
			var s=groups[i].substring(k,k+4);
			var vert=new Vert(0,0);
			this.verts[i].push(vert.unpack(s));
		}
	}
}

// Poly.prototype.render=function(){
// 	this.canvas.clear();
// 	fillPolygon(this.canvas,this.verts[0],this.fillColor);
// }

Poly.prototype.draw=function(){
	//var group=this.verts[gui.vertGroup.selected];
	if(gui.vertDrag){
		gui.vertDrag.move(mouseX,mouseY);
	}
	var count=this.countVertGroups();
	if(count>0){
		push();
		for(var i=0;i<count;i++){
			this.verts[i].push(this.verts[i][0]);
		}
		//group.push(group[0]);
		var verts=this.subdivide(this.verts,2);
		this.canvas.clear();
		if(this.fillColor<16){
			this.fill(verts);
		}
		this.line(verts);
		// noSmooth();
		// image(this.canvas,gui.canvas.x,gui.canvas.y,gui.canvas.width,gui.canvas.height);
		verts=this.verts[gui.vertGroup.selected];
		if(this.fillColor<16){
			for(var i=1;i<verts.length;i++){
				var a=verts[i-1];
				var b=verts[i];
				a=gui.canvas.cellToCanvas(a.x,a.y);
				b=gui.canvas.cellToCanvas(b.x,b.y);
				var offset=gui.canvas.cellWidth*0.5;
				a.x+=offset;
				a.y+=offset;
				b.x+=offset;
				b.y+=offset;
				stroke(0);
				strokeWeight(9);
				line(a.x,a.y,b.x,b.y);
				stroke(255);
				strokeWeight(3);
				line(a.x,a.y,b.x,b.y);
			}
		}
		this.getMidpoints();
		for(var i=0;i<this.midpoints.length;i++){
			this.midpoints[i].draw();
		}
		for(var i=0;i<verts.length;i++){
			verts[i].draw();
		}
		for(var i=0;i<count;i++){
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
	var string='';
	for(var i=0;i<16;i++){
		string=string+polys[i].pack();
	}
	return string;
}

function unpack(string){
	if(string.match(/[^0123456789abcdefgpx]/)){
		return 'Invalid string';
	}else{
		for(var i=0;i<16;i++){
			polys[i]=new Poly();
		}
		var polyIndex=0;
		var startIndex=0;
		for(var i=0;i<string.length;i++){
			if(string.charAt(i)==='p'){
				polys[polyIndex].unpack(string.substring(startIndex,i));
				startIndex=i+1;
				polyIndex++;
			}
		}
		for(var i=0;i<16;i++){
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

function sortInsert(arr,val){
	var index=arr.length;
	for(var i=arr.length-1;i>=0 && val<arr[i];i--){
		arr[i+1]=arr[i];
		index=i;
	}
	arr[index]=val;
	return arr;
}

function bresenham(a,b){
	var points=[];
  var deltaX=b.x-a.x;
  var deltaY=b.y-a.y;
  var xSign=deltaX>0?1:-1;
  var ySign=deltaY>0?1:-1;
  deltaX=abs(deltaX);
  deltaY=abs(deltaY);
	if(deltaY<deltaX){
		var slope=deltaY/deltaX;
	  for(var m=0;m<deltaX;m++){
	    var y=m*slope;
	    y=round(y*ySign)+a.y;
	    var x=m*xSign+a.x;
			points.push(x,y);
		}
	}else{
	  var slope=deltaX/deltaY;
	  for(var m=0;m<deltaY;m++){
	    var x=m*slope;
	    x=round(x*xSign)+a.x;
	    var y=m*ySign+a.y;
			points.push(x,y);
		}
	}
	return points;
}

function subdivide(a,b){
	var result=[];
  if(!a.pin){
    var x=round(a.x*0.75+b.x*0.25);
    var y=round(a.y*0.75+b.y*0.25);
		result.push(new Vert(x,y,false,a.color));
  }else{
		result.push(a);
	}
  if(!b.pin){
    var x=round(a.x*0.25+b.x*0.75);
    var y=round(a.y*0.25+b.y*0.75);
		result.push(new Vert(x,y,false,b.color));
  }else{
  	result.push(b);
  }
  return result;
}

// function magnitude(x1, y1, x2, y2) {
// 	var dx = x2 - x1;
// 	var dy = y2 - y1;
// 	return sqrt(dx * dx + dy * dy);
// }

function keyPressed(){
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