import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';

// import Pong from 'containers/Pong';
// import Court from 'components/Court';
// import Paddle from 'components/Paddle';
// import Ball from 'components/Ball';

import './App.css';

const client = new W3CWebSocket('ws://54.183.40.180:8000/ws');
// const client = new W3CWebSocket('ws://127.0.0.1:8080/ws'); 

let StartState = 0,PlayState   = 1,GameOverState = 2

/* buttons */
const PLAYER1_UP   = 38  // up arrow
const PLAYER1_DOWN = 40  // down arrow
const PAUSE       = 32  // space
const PLAYER2_UP  = 87
const PLAYER2_DOWN= 83

const InitialState = () => {
    return {
        State: 0,
        Ball: {
            X: 400,
            Y: 300,
            Radius: 10
        },
        Player1: {
            X: 50,
            Y: 300,
            Score: 0,
            Width: 20,
            Height: 100,
            Up: 38,
            Down: 40
        },
        Player2: {
            X: 750,
            Y: 300,
            Score: 0,
            Width: 20,
            Height: 100,
            Up: 87,
            Down: 83
        }
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = InitialState();
    }
    
    componentDidMount() {


        // this.state = InitialState();

            let i=0;
        client.onmessage = (message)=>{
            // console.log(message);
            let dataFromServer = JSON.parse(message.data);
            this.setState ({
                State: dataFromServer.State,
                Player1: dataFromServer.Player1,
                Player2: dataFromServer.Player2,
                Ball: dataFromServer.Ball,
            });
            // console.log(i++,this.state);
        }
        
        document.onkeydown = this.keyInput;
        // set page-wide event listeners
        document.onkeypress = this.keyInput;
        document.onkeyup = this.keyInput;
        document.title = "ping-pong"
    }

    keyInput = (evt) => {
        if([PLAYER1_DOWN,PLAYER1_UP,PLAYER2_DOWN,PLAYER2_UP,PAUSE].includes(evt.keyCode)){
            client.send(JSON.stringify({TypeOfMsg: evt.type, KeyInput: evt.keyCode}));
        }
        switch (evt.keyCode) {
            case PLAYER2_UP:
            case PLAYER2_DOWN:
                // movedPlayer = this.moveBoard(this.state.Player2, keyCode===PLAYER2_UP); 
                if (false) {
                    client.send(JSON.stringify({TypeOfMsg: evt.type, KeyInput: evt.keyCode}));
                }
                break;
            case PLAYER1_UP:
            case PLAYER1_DOWN:
                // movedPlayer = this.moveBoard(this.state.Player1, keyCode===PLAYER1_UP); 
                if (false) {
                    client.send(JSON.stringify({Player1: [1, 2, 3], Pause: false}));
                }
                break;
            case PAUSE:
                
                break;
        }

        let message;
        switch (this.state.State) {
            case StartState:
                message = "Press SPACE to Play"
            
        }
    }

    render() {
        // console.log(window.innerWidth)
        // console.log(window.innerHeight)

        return (
            <Stage width={window.innerWidth} height={window.innerHeight} style={{backgroundColor: "black"}}>
                <Layer 
                width={800} 
                height={600}  
                x={window.innerWidth/2-800/2} 
                y={window.innerHeight/2-600/2} 
                >
                    <Rect
                    width={800} 
                    height={600}  
                    x={0} 
                    y={0} 
                    fill="black"
                    stroke="teal"
                    cornerRadius={5}
                    shadowBlur={1}
                    />
                    {(this.state.State == PlayState || this.state.State == StartState) && 
                        <Text text={"Player 1: ↑ is UP, ↓ is Down\nPlayer 2: W is UP, S is Down"} x={100} y={500} fontSize={15} fill="teal"/>}
                    <Text text={this.state.Player1.Score} x={250} y={60} fontSize={35} fill="teal" />
                    <Text text={this.state.Player2.Score} x={550} y={60} fontSize={35} fill="teal" />
                    <Circle x={this.state.Ball.X} y={this.state.Ball.Y} radius={this.state.Ball.Radius} fill="teal" />
                    
                    <Rect
                    x={this.state.Player1.X-this.state.Player1.Width/2}
                    y={this.state.Player1.Y-this.state.Player1.Height/2}
                    width={this.state.Player1.Width}
                    height={this.state.Player1.Height}
                    fill="teal"
                    shadowBlur={1}
                    />
                    <Rect
                    x={this.state.Player2.X-this.state.Player2.Width/2}
                    y={this.state.Player2.Y-this.state.Player2.Height/2}
                    width={this.state.Player2.Width}
                    height={this.state.Player2.Height}
                    fill="teal"
                    shadowBlur={1}
                    />

                    {this.state.State == StartState && <Text text={"SPACE TO PLAY"} x={250} y={150} fontSize={40} fill="teal" />}
                    {this.state.State == GameOverState && <Text text={"SPACE TO RESTART"} x={210} y={150} fontSize={40} fill="teal" />}
                    {this.state.State == GameOverState && <Text text={"SPACE TO RESTART"} x={210} y={150} fontSize={40} fill="teal" />}
                    {this.state.State == GameOverState && this.state.Player1.Score == 11 &&
                     <Text text={"PLAYER 1 WON"} x={215} y={400} fontSize={50} fill="teal" />}
                    {this.state.State == GameOverState && this.state.Player2.Score == 11 &&
                     <Text text={"PLAYER 2 WON"} x={210} y={400} fontSize={40} fill="teal" />}
                    
                </Layer>
            </Stage>
        )
    }
}


export default App;