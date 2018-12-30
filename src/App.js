import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';

class Square extends React.Component {
  render(){
    return (
      <div className="square">
        {this.props.value}
      </div>
    );
  }
}

class Window extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      gameState : new Array(this.props.height).fill(0).map(() => new Array(this.props.width).fill(".")),
      socket : io("ws://localhost:1337")
    }
  }

  componentDidMount() {
    this.state.socket.on('gamestate', (data) => {
	this.setState(state => {
	   return {
	   	gameState : data
	   }
	});

    });
    
    window.addEventListener('keydown', (event) =>{
      console.log(event.key);

      if(event.key === "ArrowDown"){
        this.state.socket.emit('move', 'down');
      } else if (event.key === "ArrowUp") {
        this.state.socket.emit('move', 'up');
      } else if (event.key === "ArrowLeft") {
        this.state.socket.emit('move', 'left');
      } else if (event.key === "ArrowRight") {
        this.state.socket.emit('move', 'right');
      } else if (event.key === "Escape") {
      	this.state.socket.emit('reset');
      } 
	    
    });

  }
  
  render() {
    return(
      <div>
        {this.state.gameState.map((_, i) => {
            return <div className="board-row">{this.state.gameState[i].map((_, j) => {
              return <Square value={this.state.gameState[i][j]}/>
            })
          }</div>
        })}
      </div>
    );
  }
}

class App extends Component {

  render() {
    return (
      <div className="App">
        <Window height={20} width={20} />
      </div>
    );
  }
}

export default App;
