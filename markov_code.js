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

function init() {
    window.requestAnimationFrame(draw);
}

function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

var seconds = 0;



var start_x = -10
var start_y = 100

var circle_size = 10
var chain_width = 50
var chain_height = 50

var A1 = 0.6
var B1 = 0.2

var trans_x = 200
var emmit_x = 900
var bar_width = 400
var A_y = 300
var B_y = 400
var bar_height = 30

var AA = 0.9
var BA = 0.13

var textsize = 20

var sel_trans_A = false
var sel_trans_B = false
var sel_emmit_A = false
var sel_emmit_B = false

function arrow(x,y,tx,ty){

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    var angle = Math.atan2(ty-y, tx-x)
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + Math.cos(angle + Math.PI*0.75)*5, ty + Math.sin(angle + Math.PI*0.75)*5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + Math.cos(angle - Math.PI*0.75)*5, ty + Math.sin(angle - Math.PI*0.75)*5);
    ctx.stroke();

}

class chain{
    constructor(AA, AB, BA, BB){
        this.AA = AA
        this.AB = AB
        this.BA = BA
        this.BB = BB
        this.A = false
        this.B = false
        this.allele_1 = false
        this.allele_2 = false
    }

    draw(ctx, i){
        if(i == 99){
            return
        }
        
        ctx.font = ""+circle_size*1.5+"px serif"

        var x = start_x + i*chain_width

        if(this.A)
            ctx.strokeStyle = "#000000"
        else
            ctx.strokeStyle = "#E0E0E0"
        ctx.beginPath();
        ctx.arc(x, start_y, circle_size, 0, 2 * Math.PI);
        ctx.stroke();
        
        if(this.A)
            ctx.fillStyle = "#FF0000"
        else
            ctx.fillStyle = "#FFE0E0"
        ctx.fillText("A", x - circle_size*0.5, start_y + circle_size*0.4)

        if(this.B)
            ctx.strokeStyle = "#000000"
        else
            ctx.strokeStyle = "#E0E0E0"
        ctx.beginPath();
        ctx.arc(x, start_y + chain_height, circle_size, 0, 2 * Math.PI);
        ctx.stroke();
        if(this.B)
            ctx.fillStyle = "#0000FF"
        else
            ctx.fillStyle = "#E0E0FF"
        ctx.fillText("B", x - circle_size*0.5, start_y + chain_height + circle_size*0.4)

        if(this.A && chains[i+1].A)
            ctx.strokeStyle = "#000000"
        else
            ctx.strokeStyle = "#E0E0E0"
        arrow(x+circle_size, start_y, x + chain_width - circle_size, start_y)

        if(this.A && chains[i+1].B)
            ctx.strokeStyle = "#000000"
        else
            ctx.strokeStyle = "#E0E0E0"
        arrow(x+circle_size, start_y, x + chain_width - circle_size, start_y + chain_height)

        if(this.B && chains[i+1].A)
            ctx.strokeStyle = "#000000"
        else
            ctx.strokeStyle = "#E0E0E0"
        arrow(x+circle_size, start_y + chain_height, x + chain_width - circle_size, start_y)

        if(this.B && chains[i+1].B)
            ctx.strokeStyle = "#000000"
        else
            ctx.strokeStyle = "#E0E0E0"
        arrow(x+circle_size, start_y + chain_height, x + chain_width - circle_size, start_y + chain_height)
        
        if(this.allele_1 || this.allele_2){
            ctx.strokeStyle = "#000000"
            arrow(x, start_y + chain_height + circle_size, x , start_y + chain_height*2 - circle_size)
            ctx.beginPath();
            ctx.arc(x, start_y + chain_height*2, circle_size, 0, 2 * Math.PI);
            ctx.stroke();

            if(this.allele_1){
                ctx.fillStyle = "#FFAA00"
                ctx.fillText("1", x - circle_size*0.5, start_y + chain_height*2 + circle_size*0.4)
            }else{
                ctx.fillStyle = "#00FF00"
                ctx.fillText("2", x - circle_size*0.5, start_y + chain_height*2 + circle_size*0.4)
            }
        }
    }

    propogate(i){
        if(i == 99){
            return
        }

        if(this.A){
            if(Math.random() < this.AA){
                chains[i+1].A = true
            }else{
                chains[i+1].B = true
            }

            if(Math.random() < A1){
                this.allele_1 = true
            }else{
                this.allele_2 = true
            }
        }else{
            if(Math.random() < this.BA){
                chains[i+1].A = true
            }else{
                chains[i+1].B = true
            }

            if(Math.random() < B1){
                this.allele_1 = true
            }else{
                this.allele_2 = true
            }
        }
    }
}


var chains = []



function rerun(){

    chains = []
    for(let i = 0; i < 100; i++){
        chains.push(new chain(AA, 1-AA, BA, 1-BA))
    }

    if(Math.random() < 0.5)
        chains[0].A = true
    else
        chains[0].B = false

    for(let i = 0; i < 100; i++){
        chains[i].propogate(i)
    }
}

rerun()





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

    var title_size = 30
    ctx.font = ""+title_size+"px serif"
    ctx.fillStyle = "#000000";
    ctx.fillText("Hidden Markov Model for introgression", width/2 - title_size*8, 50)


    for(let i = 0; i < chains.length; i++){
        chains[i].draw(ctx,i)
    }

    //changing

    if(sel_trans_A){
        AA = (mouseX - trans_x)/bar_width
        if(AA < 0)
            AA = 0
        if(AA > 1)
            AA = 1
    }
    if(sel_trans_B){
        BA = (mouseX - trans_x)/bar_width
        if(BA < 0)
            BA = 0
        if(BA > 1)
            BA = 1
    }
    if(sel_emmit_A){
        A1 = (mouseX - emmit_x)/bar_width
        if(A1 < 0)
            A1 = 0
        if(A1 > 1)
            A1 = 1
    }
    if(sel_emmit_B){
        B1 = (mouseX - emmit_x)/bar_width
        if(B1 < 0)
            B1 = 0
        if(B1 > 1)
            B1 = 1
    }
    

    //A
    ctx.fillStyle = "#0000FF";
    ctx.fillRect(trans_x, A_y, bar_width, bar_height)
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(trans_x, A_y, bar_width*AA, bar_height)
    ctx.strokeStyle = "#000000"
    ctx.beginPath();
    ctx.rect(trans_x, A_y, bar_width, bar_height)
    ctx.stroke();
    ctx.fillStyle = "#FF0000";
    ctx.font = ""+textsize+"px serif"
    ctx.fillText("A", trans_x - textsize, A_y + bar_height/2 + textsize*0.32)

    ctx.fillStyle = "#000000";
    ctx.fillText("Transition rates", trans_x + bar_width/2 - textsize*3, A_y - textsize*0.32)
    ctx.fillStyle = "#000000";
    ctx.fillText("Emission rates", emmit_x + bar_width/2 - textsize*3, A_y - textsize*0.32)
    
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(emmit_x, A_y, bar_width, bar_height)
    ctx.fillStyle = "#FFAA00";
    ctx.fillRect(emmit_x, A_y, bar_width*A1, bar_height)
    ctx.strokeStyle = "#000000"
    ctx.beginPath();
    ctx.rect(emmit_x, A_y, bar_width, bar_height)
    ctx.stroke();


    //B
    ctx.fillStyle = "#0000FF";
    ctx.fillRect(trans_x, B_y, bar_width, bar_height)
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(trans_x, B_y, bar_width*BA, bar_height)
    ctx.strokeStyle = "#000000"
    ctx.beginPath();
    ctx.rect(trans_x, B_y, bar_width, bar_height)
    ctx.stroke();
    ctx.fillStyle = "#0000FF";
    ctx.fillText("B", trans_x - textsize, B_y + bar_height/2 + textsize*0.32)
    
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(emmit_x, B_y, bar_width, bar_height)
    ctx.fillStyle = "#FFAA00";
    ctx.fillRect(emmit_x, B_y, bar_width*B1, bar_height)
    ctx.strokeStyle = "#000000"
    ctx.beginPath();
    ctx.rect(emmit_x, B_y, bar_width, bar_height)
    ctx.stroke();
    
    
    window.requestAnimationFrame(draw);
}


function intersecting(x, y, width, height){
    if(mouseX < x){
        return false
    }
    if(mouseY < y){
        return false
    }
    if(mouseX > x+width){
        return false
    }
    if(mouseY > y+height){
        return false
    }
    return true
}

function doMouseDown(e){
    mouseDown = true

    if(intersecting(trans_x, A_y, bar_width, bar_height)){
        sel_trans_A = true
    }
    if(intersecting(trans_x, B_y, bar_width, bar_height)){
        sel_trans_B = true
    }
    if(intersecting(emmit_x, A_y, bar_width, bar_height)){
        sel_emmit_A = true
    }
    if(intersecting(emmit_x, B_y, bar_width, bar_height)){
        sel_emmit_B = true
    }
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

    sel_trans_A = false
    sel_trans_B = false
    sel_emmit_A = false
    sel_emmit_B = false
}

init();