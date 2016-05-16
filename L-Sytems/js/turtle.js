!function() {
  
var Vec2 = Victor // substitute vector library of your choice

// pass in canvas context, a starting x and a starting y position
Turtle = function( canvas, startX, startY ) {
  Object.assign( this, {
    canvas:null,
    weight:1,
    color:'red',
    pos: Vec2( startX, startY ),
    dir: Vec2( 0,-1) ,
    pen: 1,
    posArray: [],
    dirArray: [],
	nodeArray: [],
	neigh: 0,
	neighbors: [],
	first: true,
	nodes: false,
	neighbor: [],
    
    penUp : function() { this.pen = 0 },
    
    penDown : function() { this.pen = 1 },
    
    push: function() {
      this.posArray.push( this.pos.clone() )
      this.dirArray.push( this.dir.clone() )
	  this.nodeArray.push( this.pos.clone() )
    },
    
    pop: function() {
      this.pos = this.posArray.pop()
      this.dir = this.dirArray.pop()
      this.canvas.moveTo( this.pos.x, this.pos.y )
    },
    
    // THIS IS IN RADIANS!!!
    rotate: function( amt ) {
      this.dir.rotate( amt )
    },
    
    move: function( amt ) {
		var gradient=canvas.createLinearGradient(500,1300,0,0);
		gradient.addColorStop("0","magenta");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");
		ctx.strokeStyle = gradient;
      if( this.pen ) this.canvas.beginPath()
	  this.canvas.strokeStyle = gradient
      this.canvas.moveTo( this.pos.x, this.pos.y )
	  /*this.pos.x.toFixed();
	  this.pos.y.toFixed();*/
	  //var neighbor = [];
	if(this.first == true){
		if(this.nodeArray.length != 0){
			for(var i = 0; i < this.nodeArray.length; i++){
				if(this.nodeArray[i].x == this.pos.x && this.nodeArray[i].y == this.pos.y){
					this.neighbor[0] = this.pos.clone();
					this.first = false;
				}
			}
		}
	 }
	  else if(this.first == false){
		for(var i = 0; i < this.nodeArray.length; i++){
			if(this.nodeArray[i].x == this.pos.x && this.nodeArray[i].y == this.pos.y){
				this.neighbor[1] = this.pos.clone();
				var temp = [1];
				temp[0] = this.neighbor[0].clone();
				temp[1] = this.neighbor[1].clone();
				this.neighbors.push(temp);
				this.first = true;
				//neighbor = [];
			}
		}
	  }
	  
      this.pos.x += this.dir.x * amt
      this.pos.y += this.dir.y * amt
       //neighbor[1] = this.pos.clone();
	   
	   //console.log(neighbors[this.neigh][0]);
	   
      if( this.pen ) {
        this.canvas.lineTo( this.pos.x, this.pos.y )
        this.canvas.lineWidth = this.weight
        this.canvas.stroke()
        this.canvas.closePath()
      }else{
        this.moveTo( this.pos.x, this.pos.y )
		
      }
    },
  })
  
  this.canvas = canvas
  this.canvas.moveTo( this.pos.x, this.pos.y )
}

}()