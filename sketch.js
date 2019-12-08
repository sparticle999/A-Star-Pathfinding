function removeFromArray(arr, el){
	for(var i = arr.length-1; i>=0; i--){
		if (arr[i] == el){
			arr.splice(i,1);
		}
	}
}

function heuristic(a, b){
	var d = dist(a.i,a.j,b.i,b.j)
	return d;
}
var density = prompt("Density of Walls: (e.g. 0.34)", 0.34);
var cols = 50;
var rows = 50;
var grid = new Array(cols);
var w,h

var openSet = [];
var closedSet = [];
var start;
var end;
var current;
var path = [];;

function Spot(i,j){
	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbours = [];
	this.previous = undefined;
	this.wall = false;

	if(random(1) < density){
		this.wall = true;
	}

	this.show = function(color){
		fill(color);
		//Color walls as dots
		if(this.wall){
			fill(0);
			noStroke();
			ellipse(this.i*w+w/2, this.j*h+h/2, w/2, h/2)

			//neighbour array for only 4 cardinal directions
			var nArr = [];
			if(this.i<cols-1){
				nArr.push(grid[this.i+1][this.j]);
			}
			if(this.j <rows-1){
				nArr.push(grid[this.i][this.j+1]);
			}
			//Color connected walls as rectangles between dots
			for(var i in nArr){
				n = nArr[i];
				if(n.wall == true){
					stroke(0);
					strokeWeight(w/2);
					beginShape();
					vertex(this.i*w+w/2, this.j*h+h/2);
					vertex(n.i*w+w/2,n.j*h+h/2);
					endShape();
				}
			}
		}

		

		
		//rect(this.i*w, this.j*h, w-1, h-1)
	}

	this.addNeighbours = function(grid){
		var i = this.i;
		var j = this.j;
		if(i<cols-1){
			this.neighbours.push(grid[i+1][j]);
			if(j < rows-1){
				this.neighbours.push(grid[i+1][j+1]);
			}
		}
		if(i>0){
			this.neighbours.push(grid[i-1][j]);
			if(j > 0){
				this.neighbours.push(grid[i-1][j-1]);
			}
		}
		if(j < rows-1){
			this.neighbours.push(grid[i][j+1]);
			if(i>0){
				this.neighbours.push(grid[i-1][j+1]);
			}
		}
		if(j > 0){
			this.neighbours.push(grid[i][j-1]);
			if(i<cols-1){
				this.neighbours.push(grid[i+1][j-1]);
			}
		}
	}
}

function setup() {
	createCanvas(800,800);
	console.log('A*');

	w = width/cols;
	h = height/rows;

	// 2d array
	for(var i = 0; i < cols; i++){
		grid[i] = new Array(rows);
	}

	for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			grid[i][j] = new Spot(i,j);
		}
	}

	for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			grid[i][j].addNeighbours(grid);
		}
	}

	start = grid[0][0];
	end = grid[cols-1][rows-1];
	start.wall = false;
	end.wall = false;

	openSet.push(start);
}

function draw() {
	background(255);
	if(openSet.length > 0){
		//continue
		//current node to be evaluated
		var lowestIndex = 0;
		for(var i = 0; i < openSet.length; i++){
			if(openSet[i].f < openSet[lowestIndex].f){
				lowestIndex = i;
			}
		}
		current = openSet[lowestIndex];

		if (current == end){
			noLoop();
			document.getElementById("output").innerHTML = "Path of length " + current.g + " found!";
			console.log("DONE!");
		}

		closedSet.push(current);
		removeFromArray(openSet, current);

		var neighbours = current.neighbours;
		for(var i = 0; i < neighbours.length; i++){
			var neighbour = neighbours[i];
			//if in closed set, ignore
			if(!closedSet.includes(neighbour) && !neighbour.wall){
				//distance travelled is 1 greater than the previous node
				var tempG = current.g + 1;
				var newPath = false;
				if(openSet.includes(neighbour)){
					if(tempG < neighbour.g){
						neighbour.g = tempG;
						newPath = true;
					}
				} else {
					neighbour.g = tempG;
					newPath = true;
					openSet.push(neighbour);
				}

				if(newPath){
					neighbour.h = heuristic(neighbour, end);
					neighbour.f = neighbour.g + neighbour.h;
					neighbour.previous = current;
				}
				
			}

			
			
		}

	} else {
		noLoop();
		document.getElementById("output").innerHTML = "Sorry! No Solution Found";
		console.log("No Solution")
	}

	for(var i = 0; i < cols; i++){
			for(var j = 0; j < rows; j++){
				grid[i][j].show(color(255));
			}
		}

	for(var i = 0; i < closedSet.length; i++){
		closedSet[i].show(color(255,105,97));
	}

	for(var i = 0; i < openSet.length; i++){
		openSet[i].show(color(119,221,119));
	}

	//Find Path
	path = [];
	var temp = current;
	path.push(temp);
	while(temp.previous && (temp.i!=0 || temp.j!=0)){
		path.push(temp.previous);
		temp = temp.previous;
	}

	noFill();
	stroke(177, 156, 217);
	strokeWeight(w/4)
	beginShape();
	for(var i = 0; i < path.length; i++){
		vertex(path[i].i*w+w/2, path[i].j*h+h/2)
	}
	endShape();
}