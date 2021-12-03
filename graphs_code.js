var canvas = document.getElementById("network_creator");
canvas.addEventListener("mousedown", doMouseDown, false);
canvas.addEventListener("mousemove", doMouseMove, false);
canvas.addEventListener("mouseup", doMouseUp, false);
var ctx = canvas.getContext("2d");

canvas.width = canvas.getBoundingClientRect().width
canvas.height = canvas.getBoundingClientRect().height
var width = canvas.width;
var height = canvas.height;

var mouseX = 0;
var mouseY = 0;

var last_frame = Date.now()
var this_frame = Date.now()

function init() {
    last_frame = Date.now()
    this_frame = Date.now()
    window.requestAnimationFrame(draw);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

var seconds = 0;


var order = [0,8,2,7,3,6,4,1,9,5]
var current = 0
var without = true




function last_image(){
    if(without){
        current = (current - 1)%10
        without = false
    }else{
        without = true
    }
    update_image()
}
function next_image(){
    if(without){
        without = false
    }else{
        current = (current + 1)%10
        without = true
    }
    update_image()
}
var img = new Image(); 

function update_image(){
    console.log('graphs/'+((without)?"without":"with")+'_'+order[current]+'.png')
    img.src = 'graphs/'+((without)?"without":"with")+'_'+order[current]+'.png';
}
update_image()





function draw() {
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height
    width = canvas.width;
    height = canvas.height;

    last_frame = this_frame
    this_frame = Date.now()
    var sec = (this_frame - last_frame) / 1000.0
    seconds += sec;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);


    ctx.drawImage(img, -10, -10,width, height);
    window.requestAnimationFrame(draw);


    var title_size = 30
    ctx.font = ""+title_size+"px serif"
    ctx.fillStyle = "#000000";
    ctx.fillText("Where I need advice", width/2 - title_size*4, 50)
}



function doMouseDown(e){
    mouseDown = true
}

function doMouseMove(e){

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

}

function doMouseUp(e){
    mouseDown = false
}

init();