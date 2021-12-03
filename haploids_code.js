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
var mouseDown = false;


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






//params:
var m = 0.5;
var s = 0.2;
var n1 = 0.7;
var n2 = 0.75;
var e = 1
var f = 1


//positioning params
var chromx = 200
var chromy = 110
var chromwidth = 300

var mboxx = 1100
var mboxy = 90
var mboxwidth = 300
var mboxheight = 40

var textsize = 30

var haploids_center_x = width*0.72
var haploids_width = 500
var haploids_height = 200
var haploids_y = 220
var haploidheight = 80
var dist_box_seperation = 6
var dist_box_width = 10

var trans_sum_x = 130
var trans_sum_y = 170
var trans_sum_2y = 350
var trans_sum_division_space = 10
var trans_sum_width = 300
var trans_haploid_height_diff = 20
var plus_size = 10


function gamete_to_index(gamete){
    var index = 0
    index += gamete[0]*4
    index += gamete[1]*2
    index += gamete[2]*1
    return index
}

function index_to_gamete(index){
    var gamete = [0,0,0]
    gamete[0] = (index>=4)?1:0
    gamete[1] = (index%4>=2)?1:0
    gamete[2] = index%2
    return gamete
}

var haploids = [m,0,0,0,0,0,0,1-m]

function reset(){
    haploids = [m,0,0,0,0,0,0,1-m]
    e = parseFloat(document.getElementById("e").value)
    f = parseFloat(document.getElementById("f").value)
}

function next_gen(){
    diploids = []
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            diploids[i*8 + j] = haploids[i]*haploids[j]
        }
    }

    //pos_0 is the site index furthest down the chrom
    var pos_0 = 0
    var pos_1 = 1
    var pos_2 = 2

    var select_pos = 0

    if(s <= n1 && n1 <= n2){
        pos_0 = 0
        pos_1 = 1
        pos_2 = 2
    }else if(n2 <= n1 && n1 <= s){
        pos_0 = 2
        pos_1 = 1
        pos_2 = 0
        select_pos = 2
    }else if(n1 <= s && s <= n2){
        pos_0 = 1
        pos_1 = 0
        pos_2 = 2
        select_pos = 1
    }else if(n2 <= s && s <= n1){
        pos_0 = 2
        pos_1 = 0
        pos_2 = 1
        select_pos = 1
    }else if(s <= n2 && n2 <= n1){
        pos_0 = 0
        pos_1 = 2
        pos_2 = 1
    }else if(n1 <= n2 && n2 <= s){
        pos_0 = 1
        pos_1 = 2
        pos_2 = 0
        select_pos = 2
    }

    var site0 = Math.min(s,n1,n2)
    var site1 = 0
    var site2 = Math.max(s,n1,n2)

    if(pos_1 == 0){
        site1 = s
    }
    if(pos_1 == 1){
        site1 = n1
    }
    if(pos_1 == 2){
        site1 = n2
    }
    
    

    var new_haploids = [0,0,0,0,0,0,0,0]

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            var progeny = haploids[i]*haploids[j]
            var gamete1 = index_to_gamete(i)
            var gamete2 = index_to_gamete(j)
            if(gamete1[0] == 0 && gamete2[0] == 0){
                progeny *= e
            }
            if(gamete1[0] == 1 && gamete2[0] == 1){
                progeny *= f
            }

            //meiosis
            new_haploids[gamete_to_index(gamete1)] += site0*progeny
            new_haploids[gamete_to_index(gamete2)] += site0*progeny

            var temp = gamete1[pos_0]
            gamete1[pos_0] = gamete2[pos_0]
            gamete2[pos_0] = temp

            new_haploids[gamete_to_index(gamete1)] += (site1-site0)*progeny
            new_haploids[gamete_to_index(gamete2)] += (site1-site0)*progeny

            var temp = gamete1[pos_1]
            gamete1[pos_1] = gamete2[pos_1]
            gamete2[pos_1] = temp

            new_haploids[gamete_to_index(gamete1)] += (site2-site1)*progeny
            new_haploids[gamete_to_index(gamete2)] += (site2-site1)*progeny

            var temp = gamete1[pos_2]
            gamete1[pos_2] = gamete2[pos_2]
            gamete2[pos_2] = temp

            new_haploids[gamete_to_index(gamete1)] += (1-site2)*progeny
            new_haploids[gamete_to_index(gamete2)] += (1-site2)*progeny
        }
    }

    var sum = 0
    for(let i = 0; i < 8; i++){
        sum += new_haploids[i]
    }
    for(let i = 0; i < 8; i++){
        haploids[i] = new_haploids[i]/sum
    }

}

function fifty_gens(){
    for(let i = 0; i < 50;i++){
        next_gen()
    }
}










function draw_haploid(x,y, gamete){
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, 1, haploidheight)
    if(gamete[0] == 0)
        ctx.fillStyle = "#FF0000";
    else
        ctx.fillStyle = "#0000FF";
    draw_circle(ctx,x, y + (1-s)*haploidheight, 3, 3)
    if(gamete[1] == 0)
        ctx.fillStyle = "#FF0000";
    else
        ctx.fillStyle = "#0000FF";
    draw_circle(ctx, x, y + (1-n1)*haploidheight, 3, 3)
    if(gamete[2] == 0)
        ctx.fillStyle = "#FF0000";
    else
        ctx.fillStyle = "#0000FF";
    draw_circle(ctx,x, y + (1-n2)*haploidheight, 3, 3)

        //draw distbox
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + dist_box_seperation, y + (1-haploids[gamete_to_index(gamete)])*haploidheight, dist_box_width, haploids[gamete_to_index(gamete)]*haploidheight)
    ctx.strokeStyle = "#000000"
    ctx.beginPath();
    ctx.rect(x + dist_box_seperation, y, dist_box_width, haploidheight)
    ctx.stroke();
}

function draw_circle(ctx, x, y, radius){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
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
    ctx.fillText("Calculating effect of selection on transition rates", width/2 - title_size*10, 50)


    //changing m
    if(selecting_m){
        m = (mouseX - mboxx)/mboxwidth
        if(m<0)
            m = 0
        else if(m>1)
            m = 1
        reset()
    }

    //draw chrom
    ctx.fillStyle = "#000000";
    ctx.fillRect(chromx, chromy-1, chromwidth, 2)
    draw_circle(ctx, chromx + s*chromwidth, chromy, 5)
    draw_circle(ctx, chromx + n1*chromwidth, chromy, 5)
    draw_circle(ctx, chromx + n2*chromwidth, chromy, 5)
    ctx.font = ""+textsize+"px serif"
    ctx.fillText("s", chromx + s*chromwidth - textsize*0.2, chromy-10)
    ctx.fillText("n", chromx + n1*chromwidth - textsize*0.26, chromy-10)
    ctx.fillText("n", chromx + n2*chromwidth - textsize*0.26, chromy-10)
    ctx.font = ""+textsize/2+"px serif"
    ctx.fillText("1", chromx + n1*chromwidth + textsize*0.21, chromy-8)
    ctx.fillText("2", chromx + n2*chromwidth + textsize*0.21, chromy-8)

    //draw mbox
    ctx.fillStyle = "#0000FF";
    ctx.fillRect(mboxx, mboxy, mboxwidth, mboxheight)
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(mboxx, mboxy, mboxwidth*m, mboxheight)
    ctx.strokeStyle = "#000000"
    ctx.beginPath();
    ctx.rect(mboxx, mboxy, mboxwidth, mboxheight)
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.font = ""+textsize+"px serif"
    ctx.fillText("Admixture propotion:", mboxx - textsize*9, mboxy + mboxheight/2 + textsize*0.22)

    //draw haploids
    var haploid_seperation = haploids_width/3
    var x_start = haploids_center_x - haploids_width*0.5
    var el_width = dist_box_seperation + dist_box_width + 1
    for(let i = 0; i < 4; i++){
        gamete = index_to_gamete(i)
        var top_y = haploids_y

        draw_haploid(x_start + haploid_seperation*i, top_y, gamete)
    }
    for(let i = 4; i < 8; i++){
        gamete = index_to_gamete(i)
        var top_y = haploids_y + haploids_height - haploidheight
        
        draw_haploid(x_start + haploid_seperation*(i-4), top_y, gamete)
    }



    //draw transrate 
    function plus(x, y){
        ctx.strokeStyle = "#000000"
        ctx.fillRect(x-plus_size, y, plus_size*2, 1)
        ctx.fillRect(x, y-plus_size, 1, plus_size*2)
    }
    
    haploidheight -= trans_haploid_height_diff

    ctx.fillStyle = "#FF0000";
    ctx.font = ""+textsize+"px serif"
    ctx.fillText("AA", trans_sum_x - textsize*2, trans_sum_y + haploidheight + trans_sum_division_space + textsize*0.32)

    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 - el_width*2, trans_sum_y, [0,0,0])
    plus(trans_sum_x + trans_sum_width/2, trans_sum_y + haploidheight/2)
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 + el_width*2, trans_sum_y, [1,0,0])
    ctx.strokeStyle = "#000000"
    ctx.fillRect(trans_sum_x, trans_sum_y  + haploidheight + trans_sum_division_space, trans_sum_width, 1)
    trans_sum_y += haploidheight + 2*trans_sum_division_space
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 - el_width*6, trans_sum_y, [0,0,0])
    plus(trans_sum_x + trans_sum_width/2 - el_width*4, trans_sum_y + haploidheight/2)
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 - el_width*2, trans_sum_y, [1,0,0])
    plus(trans_sum_x + trans_sum_width/2, trans_sum_y + haploidheight/2)
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 + el_width*2, trans_sum_y, [0,0,1])
    plus(trans_sum_x + trans_sum_width/2 + el_width*4, trans_sum_y + haploidheight/2)
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 + el_width*6, trans_sum_y, [1,0,1])
    trans_sum_y -= haploidheight + 2*trans_sum_division_space

    ctx.strokeStyle = "#000000"
    ctx.fillRect(trans_sum_x + trans_sum_width + plus_size, trans_sum_y  + haploidheight + trans_sum_division_space-plus_size/2, plus_size*2, 1)
    ctx.fillRect(trans_sum_x + trans_sum_width + plus_size, trans_sum_y  + haploidheight + trans_sum_division_space+plus_size/2, plus_size*2, 1)
    var trans_0_0 = (haploids[0] + haploids[4])/(haploids[0] + haploids[4] + haploids[1] + haploids[5])
    ctx.fillText(trans_0_0.toFixed(4),trans_sum_x + trans_sum_width + plus_size*4, trans_sum_y  + haploidheight + trans_sum_division_space + textsize*0.22)



    ctx.fillStyle = "#0000FF";
    ctx.fillText("B", trans_sum_x - textsize*2, trans_sum_2y + haploidheight + trans_sum_division_space + textsize*0.32)
    ctx.fillStyle = "#FF0000";
    ctx.fillText("A", trans_sum_x - textsize*1.4, trans_sum_2y + haploidheight + trans_sum_division_space + textsize*0.32)

    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 - el_width*2, trans_sum_2y, [0,1,0])
    plus(trans_sum_x + trans_sum_width/2, trans_sum_2y + haploidheight/2)
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 + el_width*2, trans_sum_2y, [1,1,0])
    ctx.strokeStyle = "#000000"
    ctx.fillRect(trans_sum_x, trans_sum_2y  + haploidheight + trans_sum_division_space, trans_sum_width, 1)
    trans_sum_2y += haploidheight + 2*trans_sum_division_space
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 - el_width*6, trans_sum_2y, [0,1,0])
    plus(trans_sum_x + trans_sum_width/2 - el_width*4, trans_sum_2y + haploidheight/2)
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 - el_width*2, trans_sum_2y, [1,1,0])
    plus(trans_sum_x + trans_sum_width/2, trans_sum_2y + haploidheight/2)
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 + el_width*2, trans_sum_2y, [0,1,1])
    plus(trans_sum_x + trans_sum_width/2 + el_width*4, trans_sum_2y + haploidheight/2)
    draw_haploid(trans_sum_x + trans_sum_width/2 - el_width/2 + el_width*6, trans_sum_2y, [1,1,1])
    trans_sum_2y -= haploidheight + 2*trans_sum_division_space

    ctx.strokeStyle = "#000000"
    ctx.fillRect(trans_sum_x + trans_sum_width + plus_size, trans_sum_2y  + haploidheight + trans_sum_division_space-plus_size/2, plus_size*2, 1)
    ctx.fillRect(trans_sum_x + trans_sum_width + plus_size, trans_sum_2y  + haploidheight + trans_sum_division_space+plus_size/2, plus_size*2, 1)
    var trans_1_0 = (haploids[2] + haploids[6])/(haploids[2] + haploids[6] + haploids[3] + haploids[7])
    ctx.fillText(trans_1_0.toFixed(4),trans_sum_x + trans_sum_width + plus_size*4, trans_sum_2y  + haploidheight + trans_sum_division_space + textsize*0.22)









    haploidheight += trans_haploid_height_diff
    
    window.requestAnimationFrame(draw);
}





var selecting_m = false
var selecting_s = false
var selecting_n1 = false
var selecting_n2 = false



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
    
    if(intersecting(chromx + s*chromwidth - 5, chromy - 5, 10, 10)){
        selecting_s = true
    }
    else if(intersecting(chromx + n1*chromwidth - 5, chromy - 5, 10, 10)){
        selecting_n1 = true
    }
    else if(intersecting(chromx + n2*chromwidth - 5, chromy - 5, 10, 10)){
        selecting_n2 = true
    }

    if(intersecting(mboxx, mboxy, mboxwidth, mboxheight)){
        selecting_m = true
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

    if(selecting_s){
        s = (mouseX - chromx)/chromwidth
        if(s<0){
            s = 0
        }else if(s > 1){
            s = 1
        }
        reset()
    }
    if(selecting_n1){
        n1 = (mouseX - chromx)/chromwidth
        if(n1<0){
            n1 = 0
        }else if(n1 > 1){
            n1 = 1
        }
        reset()
    }
    if(selecting_n2){
        n2 = (mouseX - chromx)/chromwidth
        if(n2<0){
            n2 = 0
        }else if(n2 > 1){
            n2 = 1
        }
        reset()
    }
}

function doMouseUp(e){
    mouseDown = false

    selecting_s = false
    selecting_n1 = false
    selecting_n2 = false
    selecting_m = false
}

init();