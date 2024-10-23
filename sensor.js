class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5;
        this.rayLength=100;
        this.raySpread=Math.PI/2;
        this.rays=[];
        this.readings=[];//This helps is border detection like how far etc
    }

    update(roadBorders, traffic){
        this.#castRays();
        this.readings=[];
        for(let i=0; i<this.rays.length; i++){
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            );
        }
    }

    #getReading(ray, roadBorders, traffic){//This helps in collision detetecion By finding where the rays are touching an object or the borders
        let touches=[];

        for(let i=0; i<roadBorders.length; i++){
            const touch= getIntersection( //This function return where it touches the array that is the x and the y coordinate and also how far it is
                ray[0],ray[1],roadBorders[i][0],roadBorders[i][1]
            );
            if(touch){
                touches.push(touch);
            }
        }

        for(let i=0; i<traffic.length; i++){
            const poly=traffic[i].polygon;
            for(let j=0; j<poly.length; j++){
                const value=getIntersection(
                    ray[0],ray[1],poly[j], poly[(j+1)%poly.length]
                );
                if(value){
                    touches.push(value);
                }
            }
        }
        if(touches.lenght==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset); //Now here we can see that the map function goes through the array of objects returned by the get intersection method and fetches the offset for each element
            //The reason we need the offset or the distance is because we want to find the closest pbjet to our car
            const minOffset= Math.min(...offsets); //The min operator doesnot work well with array of objects so the ... splits each into that type on which min can work
            return touches.find(e=>e.offset==minOffset);//Here we go over all the element of the touches array and if the offset of a particular touch equal to the minoffset it will return that touch

        }

    }

    #castRays(){
        this.rays=[];
        for(let i=0; i<this.rayCount; i++){
            const rayAngle=lerp(
                -this.raySpread/2,
                this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            )+this.car.angle;
            //Now we decide the start and end pointof each ray
            const start={x:this.car.x, y:this.car.y};
            const end={
                x:this.car.x-Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start, end]); //Adding it to the rays array

        }
    }
    

    draw(ctx){
        for(let i=0; i<this.rayCount; i++){
            if (this.rays[i] && this.rays[i][0] && this.rays[i][1]) {

            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }
            ctx.beginPath(); //Begin path initiates the drawing of the line the endpoints of which will be specified by moveTo and LineTo
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo( //moveTo is used to go the place from where we start drawing our lines
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo( //This specifies till where the line will be drawn
                end.x,
                end.y
            ); 
            ctx.stroke();

            ctx.beginPath(); //Begin path initiates the drawing of the line the endpoints of which will be specified by moveTo and LineTo
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo( //moveTo is used to go the place from where we start drawing our lines
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo( //This specifies till where the line will be drawn
                end.x,
                end.y
            ); 
            ctx.stroke();
        }
    }
    }
}
    