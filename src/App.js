import React, { Component } from 'react';
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
      gameState : new Array(this.props.height).fill(0).map(() => new Array(this.props.width).fill("."))
    }
  }

  placeFood(){
    //TODO: Ensure food cannot be placed on top of the snake
    this.setState( (state) => {
      const gameState = [ ...state.gameState ];
      var y = Math.floor(Math.random() * this.props.height);
      var x = Math.floor(Math.random() * this.props.width);
      console.log(x,y)
      while(gameState[y][x] === "#"){
        y = Math.floor(Math.random() * this.props.height);
        x = Math.floor(Math.random() * this.props.width);
      }

      gameState[y][x] = "*";

      return{
        gameState : gameState
      }
    });
    
  }

  setPlayerStart(){
    this.setState(state => {
      let starty = Math.floor(this.props.height/2);
      let startx = Math.floor(this.props.width/2);
      let direction = Math.floor(Math.random() * 4);
      const gameState = [ ...state.gameState ];
      gameState[starty][startx] = "#";
      return {
        gameState : gameState,
        head : [starty,startx],
        tail : [starty,startx],
        headDirection : direction,
        tailDirections : [direction]
      };
    });    
  };

  componentDidMount() {
    this.setPlayerStart();
    this.placeFood();
    window.addEventListener('keydown', (event) =>{
      /*
        0: down
        1: up
        2: left
        3: right
      */
      this.setState((state) => {
        var headDirection = state.headDirection;
        var tailDirections = [ ...state.tailDirections ];
        
        if(event.key === "ArrowDown" && headDirection !== 1){
          headDirection = 0;
        }else if(event.key === "ArrowUp" && headDirection !== 0){
          headDirection = 1;
        }else if(event.key === "ArrowLeft" && headDirection !== 3){
          headDirection = 2;
        }else if(event.key === "ArrowRight" && headDirection !== 2){
          headDirection = 3;
        }

        if(headDirection !== state.headDirection){
          tailDirections.pop();
          tailDirections.push(headDirection);
        }

        return {
          headDirection : headDirection,
          tailDirections : tailDirections
        }
      });
    });
    this.timerID = setInterval(
        () => this.move(),
        200
      );
    }
  
  move() {
    this.setState(state => {

      console.log(state);

      const gameState = [ ...state.gameState ];
      const headDirection = state.headDirection;
      let head = [ ...state.head ];
      let tail = [ ...state.tail ];
      let tailDirections = [ ...state.tailDirections ];
      
      tailDirections.push(headDirection);

      /*
        0: down
        1: up
        2: left
        3: right
      */
      if(headDirection === 0 && (head[0] + 1 < this.props.height) && (gameState[head[0] + 1][head[1]] !== "#") && (gameState[head[0] + 1][head[1]] !== "X")){
        head = [++head[0], head[1]];
      }else if (headDirection === 1 && (head[0] - 1 >= 0) && (gameState[head[0] - 1][head[1]] !== "#") && (gameState[head[0] - 1][head[1]] !== "X")){
        head = [--head[0], head[1]];
      }else if (headDirection === 2 && (head[1] - 1 >= 0) && (gameState[head[0]][head[1] - 1] !== "#") && (gameState[head[0]][head[1] - 1] !== "X")){
        head = [head[0], --head[1]];
      }else if (headDirection === 3 && (head[1] + 1 < this.props.width) && (gameState[head[0]][head[1] + 1 ] !== "#") && (gameState[head[0]][head[1] + 1] !== "X")){
        head = [head[0], ++head[1]];
      }else{
        return{
          gameState : new Array(this.props.height).fill(0).map(() => new Array(this.props.width).fill("X"))
        };
      }

      //TODO: Add conditional logic to determine if snake grows
      if(gameState[head[0]][head[1]] !== "*"){
        let tailDirection = tailDirections.shift();
        gameState[tail[0]][tail[1]] = ".";
        if(tailDirection === 0 && (tail[0] + 1 < this.props.height)){
          tail = [++tail[0], tail[1]];
        }else if (tailDirection === 1 && (tail[0] - 1 >= 0)){
          tail = [--tail[0], tail[1]];
        }else if (tailDirection === 2 && (tail[1] - 1 >= 0)){
          tail = [tail[0], --tail[1]];
        }else if (tailDirection === 3 && (tail[1] + 1 < this.props.width)){
          tail = [tail[0], ++tail[1]];
        }
      }else{
        this.placeFood();
      }

      gameState[head[0]][head[1]] = "#";      

      return {
        gameState : gameState,
        head: head,
        tail: tail,
        headDirection : headDirection,
        tailDirections : tailDirections
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
