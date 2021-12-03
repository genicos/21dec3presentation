var canvas = document.getElementById("network_creator");
canvas.addEventListener("mousedown", doMouseDown, false);
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


class man{
    constructor(x, y, phase, color, speed, left){
        this.x = x
        this.y = y
        this.phase = phase
        this.color = color
        this.speed = speed
        this.left = left
        this.step = 1
    }

    draw(ctx, seconds){

        ctx.strokeStyle = this.color

        seconds *= this.speed

        if(this.left){
            ctx.beginPath();
            ctx.arc(this.x + 2*Math.sin(seconds + this.phase), this.y - 5, 5, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.beginPath()
            ctx.moveTo(this.x + 3*Math.sin(seconds + this.phase), this.y)
            ctx.bezierCurveTo(this.x + 7, this.y , this.x + 7, this.y + 15 , this.x, this.y + 15)
            ctx.bezierCurveTo(this.x - 7, this.y + 15, this.x - 5, this.y + 25, this.x, this.y + 25)
            ctx.stroke();
        }else{
            ctx.beginPath();
            ctx.arc(this.x - 2*Math.sin(seconds + this.phase), this.y - 5, 5, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.beginPath()
            ctx.moveTo(this.x - 3*Math.sin(seconds + this.phase), this.y)
            ctx.bezierCurveTo(this.x - 7, this.y , this.x - 7, this.y + 15 , this.x, this.y + 15)
            ctx.bezierCurveTo(this.x + 7, this.y + 15, this.x + 5, this.y + 25, this.x, this.y + 25)
            ctx.stroke();
        }
    }


    tick(seconds){
        
        if(this.step == 2){
            var trans_speed = 2;
            if(seconds >= this.step2_begin + trans_speed){
                this.step == 3
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
        this.step3x = width*0.5 + spread*randn_bm();
        this.step3y = 300 + spread*randn_bm();
    }
}



var wiggly_men = []

var spread = 50

//A boys
for(let i = 0; i < 100; i++){
    wiggly_men.push(new man(width*0.25 + spread*randn_bm(),200 + spread*randn_bm(), Math.random()*2*Math.PI, "rgb(255,0,0)", 2*Math.random(), (Math.random()>0.5)))
}

//B boys
for(let i = 0; i < 100; i++){
    wiggly_men.push(new man(width*0.75 + spread*randn_bm(),200 + spread*randn_bm(), Math.random()*2*Math.PI, "rgb(0,0,255)", 2*Math.random(), (Math.random()>0.5)))
}

function reset(){
    wiggly_men = []

    //A boys
    for(let i = 0; i < 100; i++){
        wiggly_men.push(new man(width*0.25 + spread*randn_bm(),200 + spread*randn_bm(), Math.random()*2*Math.PI, "rgb(255,0,0)", 2*Math.random(), (Math.random()>0.5)))
    }

    //B boys
    for(let i = 0; i < 100; i++){
        wiggly_men.push(new man(width*0.75 + spread*randn_bm(),200 + spread*randn_bm(), Math.random()*2*Math.PI, "rgb(0,0,255)", 2*Math.random(), (Math.random()>0.5)))
    }
}


function send_to_step_2(){
    if(wiggly_men[0].step != 1){
        prev_colors = []
        for(let i = 0; i < wiggly_men.length; i++){
            prev_colors.push(wiggly_men[i].color)
        }

        //recoloring
        for(let i = 0; i < wiggly_men.length; i++){
            var rgb = wiggly_men[i].color

            rgb = rgb.substring(4, rgb.length-1)
                    .replace(/ /g, '')
                    .split(',')
            
            var red1 = parseInt(rgb[0])
            var blue1 = parseInt(rgb[2])

            rgb = prev_colors[Math.floor(Math.random()*prev_colors.length)]

            rgb = rgb.substring(4, rgb.length-1)
                    .replace(/ /g, '')
                    .split(',')
            
            var red2 = parseInt(rgb[0])
            var blue2 = parseInt(rgb[2])

            if(red2 > red1){
                var new_red = Math.floor((red1*0.4 + red2*0.6))
                var new_blue = Math.floor((blue1*0.4 + blue2*0.6))
            }else{
                var new_red = Math.floor((red1*0.6 + red2*0.4))
                var new_blue = Math.floor((blue1*0.6 + blue2*0.4))
            }

            

            wiggly_men[i].color = "rgb("+new_red+",0,"+new_blue+")"
        }
    }

    for(let i = 0; i < wiggly_men.length; i++){
        wiggly_men[i].enter_step2(seconds)
    }
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

    var title_size = 40
    ctx.font = ""+title_size+"px serif"
    ctx.fillStyle = "#000000";
    ctx.fillText("Inferring generalized forms of selection in introgressed populations", width/2 - title_size*13, 60)
    
    for(let i = 0; i < wiggly_men.length; i++){
        wiggly_men[i].draw(ctx, seconds)
        wiggly_men[i].tick(seconds)
    }
    
    window.requestAnimationFrame(draw);
}



function doMouseDown(e){

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}

init();