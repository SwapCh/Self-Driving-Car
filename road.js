class Road{
    constructor(x,width, laneCount=3){
        this.x=x; //x is the center of the canvas supplied in main js file
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;
        this.right=x+width/2;

        const infinity=1000000000000;
        this.top=-window.innerHeight*50; //possible wrong could be 0
        this.bottom=infinity;
        
        //Now we make the endpoints of the borders
        const topLeft={x:this.left, y:this.top}; //This is basically an object that holds the position x=this.left and so on
        const topRight={x:this.right, y:this.top};
        const bottomLeft={x:this.left, y:this.bottom};
        const bottomRight={x:this.right, y:this.bottom};
        this.borders=[ //This holds 2 lines segments 
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    //For Placint the car at the center of the lanes
    getlaneCenter(laneIndex){
        //The car will be within the lane number specified as laneIndex
        const laneWidth=this.width/this.laneCount;
        return this.left+laneWidth/2+ Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        //Drawing the lines on the road
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        //Drawing the designs on road by linear interpolation
        for(let i=1 ;i<=this.laneCount-1; i++){
            const x=lerp(
                this.left,this.right, i/this.laneCount
            );

        /*if(i>0 && i<this.laneCount){
            ctx.setLineDash([20,20]);
        }else{
            ctx.setLineDash([]);
        }*/

        ctx.setLineDash([20,20]);
        

        //Drawing a verticle line on the left side og the screen
        ctx.beginPath();
        ctx.moveTo(x,this.top);
        ctx.lineTo(x,this.bottom);
        ctx.stroke(); 
    }
    
    ctx.setLineDash([]);
    this.borders.forEach(border=>{
        ctx.beginPath();
        ctx.moveTo(border[0].x, border[0].y);
        ctx.lineTo(border[1].x, border[1].y);
        ctx.stroke();
    });
}
}

