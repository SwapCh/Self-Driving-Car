class Visualizer{
    static drawNetwork(ctx, network){
        const margin=50;
        const left=margin;
        const top=margin;
        const width=ctx.canvas.width-margin*2;
        const height=ctx.canvas.height-margin*2;

        /*
        Visualizer.drawLevel(ctx, network.levels[0],
            left, top,
            width,height
        );*/

        //Instead of drawing the levels like the above commented code we write--

        const levelHeight= height/network.levels.length;

        for(let i=network.levels.length-1; i>=0 ; i--){
            const levelTop=top+
                lerp(height-levelHeight, 0,
                    network.levels.length==1?0.5:i/(network.levels.length-1)
                );
            ctx.setLineDash([7,3]);//Line of 7 pixels and Spacing of 3
            Visualizer.drawLevel(ctx, network.levels[i], left,
                levelTop, width, levelHeight,
                i==network.levels.length-1?['🠉','🠈','🠊','🠋']
                :[]);//Here the last arguments checks if it is the last level if yes then we put in the arrow function
        }
    }

    static drawLevel(ctx, level,left, top, width, height, outputLabels){
        const right=left+width;
        const bottom=top+height;

        const {inputs, outputs, weights, biases}= level; //to shorten the code

        const nodeRadius=18;

        for(let i=0; i<inputs.length; i++){
            for(let j=0; j<outputs.length; j++){
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
            
                ctx.lineTo(Visualizer.#getNodeX(outputs, j , left, right), top);
                ctx.lineWidth=2;

                
                ctx.strokeStyle=getRGBA(weights[i][j]);
                ctx.stroke();
                //So Yellow means positive connection and Blue means negative connection! The transparancy determines how much positve or negative it is
              
            };
        }

        for(let i=0; i<level.inputs.length; i++){ //Here we Loop through each of the inputs and figure out the X coordinate
           // const x= lerp(left, right, level.inputs.length==1?0.5:(i/(level.inputs.length-1)));
            const x=Visualizer.#getNodeX(inputs, i, left, right);

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius*0.6, 0, Math.PI*2);
            ctx.fillStyle=getRGBA(inputs[i]);
            ctx.fill();
        }

        for(let i=0; i<level.outputs.length; i++){ //Here we Loop through each of the inputs and figure out the X coordinate
            const x=Visualizer.#getNodeX(outputs, i , left, right);

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius*0.6, 0, Math.PI*2);
            ctx.fillStyle=getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.arc(x, top, nodeRadius*0.8, 0,Math.PI*2);
            ctx.strokeStyle=getRGBA(biases[i]);
            ctx.setLineDash([3,3]); //This just makes the Bias Border Cooler
            ctx.stroke();
            ctx.setLineDash([]);

            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign="center";
                ctx.textBaseline="middle";  
                ctx.fillStyle="black";
                ctx.strokeStyle="white";
                ctx.font=(nodeRadius*1.5)+ "px Arial";
                ctx.fillText(outputLabels[i], x,top+nodeRadius*0.1);
                ctx.lineWidth=0.5;
                ctx.strokeText(outputLabels[i], x,top+nodeRadius*0.1);
            }
        }

        
    }

    static #getNodeX(nodes, index, left, right){ //Since thos part is getting repeated so many times so we a make a function out of it, this basically gives the position and the spacing for the nodes
        return lerp(
            left, right, nodes.length==1?0.5:index/(nodes.length-1)
            );
    }
        
}
