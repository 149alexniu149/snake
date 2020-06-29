import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';



class Square extends React.Component {
  render(){
    var squareStlye = {
      color: this.props.color
    };
    return (
      <div className="square" style={squareStlye}>
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
      socket : io("ws://107.20.73.90:1337"),
      colorMap : {}
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

    this.state.socket.on('colors', (data) => {
      console.log("Colors Updated");
	    this.setState(state => {
	      return {
	   	    colorMap : data
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
      } else if (event.key === "W") {
        this.state.socket.emit('move', 'up');
      } else if (event.key === "A") {
        this.state.socket.emit('move', 'left');
      } else if (event.key === "D") {
        this.state.socket.emit('move', 'right');
      } else if (event.key === "S") {
      	this.state.socket.emit('move', 'down');
      } 
	    
    });

  }
  
  render() {
    return(
      <div>
        {this.state.gameState.map((_, i) => {
            return <div className="board-row">{this.state.gameState[i].map((_, j) => {
              let squareColor = "black";
              if (this.state.gameState[i][j] === "@") {
                squareColor = "red";
              } else if(this.state.gameState[i][j] === "." && this.state.gameState[i][j] === "X") {
                squareColor = "black";
              } else {
                squareColor = this.state.colorMap[this.state.gameState[i][j]];
              }
              return <Square value={this.state.gameState[i][j]} color={squareColor}/>
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
