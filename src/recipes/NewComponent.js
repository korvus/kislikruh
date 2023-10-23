import React from 'react';
import '../style/styleRecipes.css';

export default class NewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeName: '',
      ingredients: '',
      instructions: '',
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle the submission of the form
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Recipe Name:
          <input type='text' name='recipeName' onChange={this.handleInputChange} />
        </label>
        <label>
          Ingredients:
          <textarea name='ingredients' onChange={this.handleInputChange} />
        </label>
        <label>
          Instructions:
          <textarea name='instructions' onChange={this.handleInputChange} />
        </label>
        <input type='submit' value='Submit' />
      </form>
    );
  }
}