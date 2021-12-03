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









var chrom_height = 100


class man{
    constructor(x, y, anc){
        this.x = x
        this.y = y
        this.anc = anc
        this.split = []
        this.step = 1
    }

    draw(ctx){

        var color = (this.anc == 1)
        ctx.fillStyle = (color)?"#0000FF":"#FF0000"

        if(this.split.length == 0){
            ctx.fillRect(this.x, this.y, 2, chrom_height)
            return
        }

        ctx.fillRect(this.x, this.y, 2, this.split[0]*chrom_height)
        
        for(let i = 1; i < this.split.length; i++){
            color = !color
            ctx.fillStyle = (color)?"#0000FF":"#FF0000"
            ctx.fillRect(this.x, this.y + this.split[i - 1]*chrom_height, 2, (this.split[i]-this.split[i - 1])*chrom_height)
        }
        color = !color
        ctx.fillStyle = (color)?"#0000FF":"#FF0000"
        
        
        ctx.fillRect(this.x, this.y + this.split[this.split.length - 1]*chrom_height, 2, (1-this.split[this.split.length - 1])*chrom_height)
    }


    tick(seconds){
        
        if(this.step == 2){
            var trans_speed = 2;
            if(seconds >= this.step2_begin + trans_speed){
                this.step = 3
                this.x = this.step3x;
                this.y = this.step3y;
            }else{
                this.x = (seconds - this.step2_begin)/trans_speed * (this.step3x - this.step1x) + this.step1x
                this.y = (seconds - this.step2_begin)/trans_speed * (this.step3y - this.step1y) + this.step1y
            }
        }
    }

    enter_step2(seconds){
        this.step = 2
        this.step2_begin = seconds;
        this.step1x = this.x;
        this.step1y = this.y;
        this.step3x = width*0.5 + 2*spread*randn_bm();
        this.step3y = 200 + 2*spread*randn_bm();
    }

    ancestry_at(site){
        var anc = this.anc

        if(this.split.length == 0){
            return anc
        }
        for(let i = 0; i < this.split.length; i++){
            if(site < this.split[i]){
                return anc
            }
            anc = 1-anc
        }
        return anc
    }
}



var wiggly_men = []

var spread = 50

var men = 100

//A boys
for(let i = 0; i < men/2; i++){
    wiggly_men.push(new man(width*0.25 + spread*randn_bm(),200 + spread*randn_bm(),0))
}

//B boys
for(let i = 0; i < men/2; i++){
    wiggly_men.push(new man(width*0.75 + spread*randn_bm(),200 + spread*randn_bm(),1))
}

function reset(){
    wiggly_men = []
    
    //A boys
    for(let i = 0; i < men/2; i++){
        wiggly_men.push(new man(width*0.25 + spread*randn_bm(),200 + spread*randn_bm(),0))
    }

    //B boys
    for(let i = 0; i < men/2; i++){
        wiggly_men.push(new man(width*0.75 + spread*randn_bm(),200 + spread*randn_bm(),1))
    }
}



var selection = false
function turn_selection_on(){
    selection = true;
}
function turn_selection_off(){
    selection = false;
}


function send_to_step_2(){
    if(wiggly_men[0].step != 1){
        //recombination
        old_wiggly_men = []
        for(let i = 0; i < men; i++){
            old_wiggly_men.push(new man(0,0, wiggly_men[i].anc))
            old_wiggly_men[i].split = wiggly_men[i].split
        }
        for(let i = 0; i < men; i++){
            var mom = old_wiggly_men[Math.floor(Math.random()*men)]
            var dad = old_wiggly_men[Math.floor(Math.random()*men)]

            if(selection){
                var reroll = 0.4
                if((mom.ancestry_at(0.5) != 0 || dad.ancestry_at(0.5) != 0) && Math.random() < reroll){
                    mom = old_wiggly_men[Math.floor(Math.random()*men)]
                    dad = old_wiggly_men[Math.floor(Math.random()*men)]
                }
            }

            var split_point = Math.random();
            wiggly_men[i].anc = mom.anc
            wiggly_men[i].split = []
            
            for(let j = 0; j < mom.split.length; j++){
                if(mom.split[j] < split_point){
                    wiggly_men[i].split.push(mom.split[j])
                }
            }

            if(mom.ancestry_at(split_point) != dad.ancestry_at(split_point)){
                wiggly_men[i].split.push(split_point)
            }

            for(let j = 0; j < dad.split.length; j++){
                if(dad.split[j] > split_point){
                    wiggly_men[i].split.push(dad.split[j])
                }
            }
        }

    }

    for(let i = 0; i < wiggly_men.length; i++){
        wiggly_men[i].enter_step2(seconds)
    }
}










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
    ctx.fillText("Effect of selection and generations on DNA tract length", width/2 - title_size*11, 60)
    
    
    
    for(let i = 0; i < wiggly_men.length; i++){
        wiggly_men[i].draw(ctx)
        wiggly_men[i].tick(seconds)
        
        var color = (wiggly_men[i].anc == 1)
        ctx.fillStyle = (color)?"#0000FF":"#FF0000"


        if(wiggly_men[i].step != 1){

            var x = 100
            var y = 100 + 2*i
            
            if(wiggly_men[i].split.length == 0){
                ctx.fillRect(x, y, chrom_height, 2)
                continue
            }
            
            ctx.fillRect(x, y, wiggly_men[i].split[0]*chrom_height, 2)
            
            for(let j = 1; j < wiggly_men[i].split.length; j++){
                color = !color
                ctx.fillStyle = (color)?"#0000FF":"#FF0000"
                ctx.fillRect(x + wiggly_men[i].split[j - 1]*chrom_height, y, (wiggly_men[i].split[j]-wiggly_men[i].split[j - 1])*chrom_height, 2)
            }
            color = !color
            ctx.fillStyle = (color)?"#0000FF":"#FF0000"
            
            ctx.fillRect(x + wiggly_men[i].split[wiggly_men[i].split.length - 1]*chrom_height, y,(1-wiggly_men[i].split[wiggly_men[i].split.length - 1])*chrom_height, 2)
        }
        
    }

    if(wiggly_men[0].step != 1 && selection)
        arrow(100 + chrom_height/2, 100 - 50, 100 + chrom_height/2, 100)
    
    window.requestAnimationFrame(draw);
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