class NeuralNetwork{
    constructor(neuronCounts){ //NeuronCounts is the no of neurons in each layer
        this.levels=[];
        for(let i=0; i<neuronCounts.length-1; i++){ //Now through thiss loop we update the input and output of each layer
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i+1]
            )); //So each element in the levels array consists of [ipcount,opcount]
        }
    }

    static feedForward(givenInputs, network){
        let outputs=Level.feedForward(
            givenInputs, network.levels[0]
        );//calling the first level to produce its outputs
    
        //Now we update th remaining layers
        for(let i=1; i<network.levels.length; i++){
            outputs=Level.feedForward(
                outputs, network.levels[i]);
        }
        return outputs;
    }

    static mutate(network, amount=1){ //Over here we update the value of the bias from the old value to a new value between -1 and 1 and how much difference between old and new will be decided by "amount"
        network.levels.forEach(level=>{//NOw we go over every bias in each level
            for(let i=0; i<level.biases.length; i++){
                level.biases[i]=lerp(
                    level.biases[i], Math.random()*2-1, amount
                );
            }
            //Similarly again we mutate the weights using interpolation
            for(let i=0; i<level.weights.length; i++){
                for(let j=0; j<level.weights[i].length; j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j], Math.random()*2-1,amount
                    );
                }
            }
        });//Now if the amount is zero then the values reamin the same but if not then the values will move away from their originals depending upon the magn itude of amount

    }
}

class Level{
    constructor(inputCount, outputCount){
        this.inputs= new Array(inputCount);
        this.outputs=new Array(outputCount);
        this.biases=new Array(outputCount);

        this.weights=[]
        //Now each input node will be connected to OuputCount no of output nodes
        //So each input node will have outputCount no of weights associated with it
        //So in the weights array each element is another array representing the weights of a single input node connected to all outputnodes

        for(let i=0; i<inputCount; i++){
            this.weights[i]=new Array(outputCount);
        }
        Level.#randomize(this);
    }

    static #randomize(level){//Here we initialize each node with a random value
        for(let i=0; i<level.inputs.length; i++){
            for(let j=0; j<level.outputs.length; j++){
                level.weights[i][j]=Math.random()*2-1; //Now this sets all the weights to a random value between 1 and -1
            }           
        }

        for(let i=0; i<level.biases.length; i++){
            level.biases[i]=Math.random()*2-1;
        }
    }

    //So now we start designing the Neural network, and heres the logic--
    //First--> For each output-- we loop through all the inputs of a level and Sum the product of weights and the input
    //Next if that sum is > the bias of that particular output then we fire the neuron by output=1
    //Repeat this for all the neurons
    
    static feedForward(givenInputs, level){
        for(let i=0; i<level.inputs.length; i++){
            level.inputs[i]=givenInputs[i];
        }

        for(let i=0; i<level.outputs.length; i++){
            let sum=0;
            for(let j=0; j<level.inputs.length; j++){
                sum+=level.weights[j][i]*level.inputs[j];
            }

            if((sum)>level.biases[i]){
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            }
        }

        return level.outputs;
    }

}