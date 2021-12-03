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
var start_y = 120

var circle_size = 4
var chain_width = 20
var chain_height = 40

var A1 = 0.6
var B1 = 0.2


var emmit_x = 900
var bar_width = 400
var A_y = 300
var B_y = 400
var bar_height = 30


var textsize = 20

var sel_emmit_A = false
var sel_emmit_B = false

var s = 0.38
var e = 1
var f = 1

var m = 0.5
var mboxx = 300
var mboxy = 340
var mboxwidth = 300
var mboxheight = 40
var selecting_m = false

var gens = 50

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








function calc_trans(n1, n2, gen){

    var haploids = [m,0,0,0,0,0,0,1-m]

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

    for(let i = 0; i < gen; i++){
        next_gen()
    }

    var results = []
    results[0] = (haploids[0] + haploids[4])/(haploids[0] + haploids[4] + haploids[1] + haploids[5])
    results[1] = 1 - results[0]
    results[2] = (haploids[2] + haploids[6])/(haploids[2] + haploids[6] + haploids[3] + haploids[7])
    results[3] = 1 - results[2]
    return results
}

function update(){
    e = parseFloat(document.getElementById("e").value)
    f = parseFloat(document.getElementById("f").value)
    gens = parseFloat(document.getElementById("gens").value)

    chains = []

    for(let i = 0; i < 100; i++){
        var trans = calc_trans(i/100.0, (i+1)/100.0, gens)
        chains.push(new chain(trans[0], trans[1], trans[2], trans[3]))
    }
    if(Math.random() < m)
        chains[0].A = true
    else
        chains[0].B = false

    for(let i = 0; i < 100; i++){
        chains[i].propogate(i)
    }

}




update()






























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
    ctx.fillText("Applying transition rates to markov chain", width/2 - title_size*8.5, 50)


    for(let i = 0; i < chains.length; i++){
        chains[i].draw(ctx,i)
    }

    //changing
    if(selecting_m){
        m = (mouseX - mboxx)/mboxwidth
        if(m<0)
            m = 0
        else if(m>1)
            m = 1
        update()
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
    ctx.fillStyle = "#FF0000";
    ctx.font = ""+textsize+"px serif"
    ctx.fillText("A", emmit_x - textsize, A_y + bar_height/2 + textsize*0.32)

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
    ctx.fillText("B", emmit_x - textsize, B_y + bar_height/2 + textsize*0.32)
    
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(emmit_x, B_y, bar_width, bar_height)
    ctx.fillStyle = "#FFAA00";
    ctx.fillRect(emmit_x, B_y, bar_width*B1, bar_height)
    ctx.strokeStyle = "#000000"
    ctx.beginPath();
    ctx.rect(emmit_x, B_y, bar_width, bar_height)
    ctx.stroke();


    //draw selection point
    arrow(start_x + chain_width*s*100, start_y - 50, start_x + chain_width*s*100, start_y-circle_size)
    
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

    if(intersecting(emmit_x, A_y, bar_width, bar_height)){
        sel_emmit_A = true
    }
    if(intersecting(emmit_x, B_y, bar_width, bar_height)){
        sel_emmit_B = true
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

}

function doMouseUp(e){
    mouseDown = false

    sel_emmit_A = false
    sel_emmit_B = false
    selecting_m = false
}

init();