import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Item from './components/Item';
import Footer from './components/Footer';
import characters from "./characters.json";
import './App.css';

class App extends Component {
  constructor(){
    super()

    this.handleShuffleChararcters = this.handleShuffleChararcters.bind(this)
  }

  state = {
    score: 0,
    topScore: 0,
    maxScore: 12,
    message: "Click an image to begin!",
    messageClass: "",
    characters: characters
  };

  shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleCorrectSelection = () => {
    
    if (this.state.score+1 > this.state.topScore) {
      this.setState({topScore: this.state.topScore+1})
    }
    if (this.state.score+1 === this.state.maxScore) {
      this.setState({score: this.state.score+1, message: "Congrats! You win!", messageClass:"correct"})
    }else{
      this.setState({score: this.state.score+1, message: "You guessed correctly!", messageClass:"correct"})
    }
  }

  handleResetWin = (currentCharacters) => {
    if (this.state.score+1 === this.state.maxScore) {
      this.setState({score: 0, topScore: 0})
      const updatedCharacters = currentCharacters.map(ch => (true) ? { ...ch, isClicked: false } : ch)
      return updatedCharacters
    }else{
      return currentCharacters
    }
  }

  handleIncorrectSelection = () => {
    this.setState({score: 0, message: "You guessed incorrectly!"})
    const updatedCharacters = this.state.characters.map(ch => ch.isClicked === true ? { ...ch, isClicked: false } : ch)
    return updatedCharacters
  }


  handleShuffleChararcters = (name) => {
    var resetNeeded = false;
    const characters = this.state.characters.map(ch => {
      if(ch.name === name) {
        if (ch.isClicked === false) {
          this.handleCorrectSelection()
          return { ...ch, isClicked: true}
        }else{
          resetNeeded = true
          return { ...ch, isClicked: false}
        }
      }
      return ch
    })

    if (resetNeeded) {
      this.setState({
        characters: this.shuffle(this.handleIncorrectSelection()),
        messageClass:"incorrect"
      })
      
    }else{
      this.setState({ characters: this.shuffle(this.handleResetWin(characters)) })
    }
    
  }

  handleRenderCharacters = () => {
    return this.state.characters.map((character) =>
            <Item 
              image={character.image} 
              name={character.name} 
              key={character.id} 
              onClick={this.handleShuffleChararcters} 
            />
          );
  }

  render() {
    return (
      <div className="App">
        <Navbar
          score={this.state.score}
          topscore={this.state.topScore}
          message={this.state.message}
          messageClass={this.state.messageClass}
        />
        <Header />
        <div className="content">
          {this.handleRenderCharacters()}
        </div>
        <Footer />;
      </div>
    );
  }
}

export default App;