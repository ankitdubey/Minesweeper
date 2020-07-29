import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Modal, Button } from "react-bootstrap";

const cellStyle = {
  marginRight: "2px",
  height: "100px",
  width: "100px",
  backgroundColor: "#0072ff",
  border: "2px solid #9c94dbba",
  fontWeight: "bold",
  cursor: "pointer"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfRows: 2,
      numberOfColumn: 2,
      gridSize: 4,
      minesArray: [],
      startGame: false,
      showModal: false,
      score: 0,
      showForm: true,
      isGameOver: false,
    };
  }

  handleClose = () => {
    this.setState({ showModal: false });
  };
  handleShow = () => {
    this.setState({ showModal: true });
  };

  playAgain = () => {
    this.setState({
      showModal: false,
      showForm: true,
      startGame: false,
      isGameOver:false,
      score: 0,
      gridSize:4,
      minesArray:[],
      numberOfRows: 2,
      numberOfColumn: 2
    });
  };

  renderModel = () => {
    return (
      <>
        <Modal show={this.state.showModal} onHide={this.playAgain}>
          <Modal.Header closeButton>
            <Modal.Title>Game Over !!!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Game over you found a bomb, final score : {this.state.score}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.playAgain}>
              Close
            </Button>
            <Button variant="primary" onClick={this.playAgain}>
              Play Again
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  setNumberOfRows = (event) => {
    event.preventDefault();
    this.setState({ numberOfRows: event.target.value });
  };
  setNumberOfColumn = (event) => {
    event.preventDefault();
    this.setState({ numberOfColumn: event.target.value });
  };

  startGame = () => {
    const { numberOfRows, numberOfColumn } = this.state;
    let gridSize = numberOfRows * numberOfColumn;
    let minesArray = [];
    let numberOfMines = parseInt(gridSize / 3);
    for (let i = 0; i < numberOfMines; i++) {
      let randomNumber =  Math.floor(Math.random() * gridSize) + 1  ; // Generate random number upto grid size
      minesArray.push(randomNumber); // pushing mines for grid columns
    }
    console.log("minesArray : ",minesArray);
    this.setState({
      gridSize: gridSize,
      minesArray: minesArray,
      startGame: true,
      showForm: false,
    });
  };

  getGridElements = () => {
    const { numberOfRows, numberOfColumn } = this.state;
    const rows = [];
    let id = 1;
    for (let j = 0; j < numberOfRows; j++) {
      const columns = [];
      for (let i = 0; i < numberOfColumn; i++) {
        columns.push(
          <div key={i} id={id} style={cellStyle} onClick={this.clicked}></div>
        );
        id++;
      }
      rows.push(
        <div className="row" style={{ display: "flex" }} id={j} key={j}>
          {columns}
        </div>
      );
    }

    return <div>{rows}</div>;
  };

  findAdjacentMines = (number, minesArray) => {
    let countOfAdjacent = 0;
    if(number>0){
      let leftElement = number - 1;
      let rightElement = number + 1;
      if (minesArray.includes(leftElement)) {
        countOfAdjacent++;
      }
      if (minesArray.includes(rightElement)) {
        countOfAdjacent++;
      }
    }
    return countOfAdjacent;
  };

  clicked = (event) => {
    let columnId = parseInt(event.target.id);
    let isGameOver = this.state.isGameOver;
    const { minesArray } = this.state;
    console.log("minesArray : ",minesArray);
    console.log("columnId : ",columnId);
    if (minesArray.indexOf(columnId) > -1) {
      isGameOver = true;
    }
    if (isGameOver) {
      event.target.style.background = "#d72f2f";
      event.target.innerHTML = "It's a Bomb, Game Over";
      this.setState({ showModal: true, isGameOver: isGameOver });
    } else {
      this.setState({ score: this.state.score + 10 });
      let findAdjacentNumber = this.findAdjacentMines(columnId, minesArray);
      event.target.style.background = "#00ff4e9e";
      event.target.innerHTML = "Be carefull " + findAdjacentNumber +" bomb around you clicked";
      this.setState({ isGameOver: isGameOver });
    }
  };

  render() {
    return (
      <>
        {this.renderModel()}
        <div className="App">
          <header className="App-header">
            <h1>Minesweeper</h1>
          </header>
          <div className="container">
            <div className="row mb-2">
              <div className="col-4"></div>
              <div className="col-4" style={{background:"#cbd4dd"}}>
                {this.state.showForm && (
                  <form>
                    <div className="form-group">
                      <label htmlFor="rows">Defalut size is 2 X 2</label>
                      <input
                        placeholder="Enter the number of rows"
                        type="number"
                        className="form-control"
                        id="rows"
                        name="rows"
                        min="2"
                        onChange={this.setNumberOfRows}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        placeholder="Enter the number of columns"
                        type="number"
                        className="form-control"
                        id="columns"
                        name="columns"
                        min="2"
                        onChange={this.setNumberOfColumn}
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary mb-3"
                      name="startButton"
                      value=" Start"
                      onClick={this.startGame}
                    >
                      Start Game
                    </button>
                  </form>
                )}
              </div>
            </div>

            {this.state.startGame && (
              <>
                <p>
                  Score : <strong>{this.state.score}</strong>
                </p>
                <div className="row">
                  <div className="col-4"></div>
                  <div className="col-8">{this.getGridElements()}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;
