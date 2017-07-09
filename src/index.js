import React from 'react';
import ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';
import * as ReactBootstrap from 'react-bootstrap';
import 'react-bootstrap/lib/Button';
import 'react-bootstrap/lib/Panel';
import 'react-bootstrap/lib/FormGroup';
import 'react-bootstrap/lib/FormControl';
import 'react-bootstrap/lib/ControlLabel';
import 'react-bootstrap/lib/Accordion';
import 'react-bootstrap/lib/ButtonToolbar';
import 'react-bootstrap/lib/Modal';
import 'react-bootstrap/lib/ListGroup';
import 'react-bootstrap/lib/ListGroupItem';
import 'bootstrap/dist/css/bootstrap.css';

var Panel = ReactBootstrap.Panel, Accordion = ReactBootstrap.Accordion;
var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var FormGroup = ReactBootstrap.FormGroup,FormControl = ReactBootstrap.FormControl,ControlLabel=ReactBootstrap.ControlLabel;
var ListGroup = ReactBootstrap.ListGroup,ListGroupItem = ReactBootstrap.ListGroupItem;

// Load Recipe Items or set default Recipe Items
var recipes = (typeof localStorage["recipeBook"] !== "undefined") ? JSON.parse(localStorage["recipeBook"]) : [
  {id:1,title: "Pumpkin Pie", ingredients: ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"]}, 
  {id:2,title: "Spaghetti", ingredients: ["Noodles", "Tomato Sauce", "(Optional) Meatballs"]}, 
  {id:3,title: "Onion Pie", ingredients: ["Onion", "Pie Crust", "Sounds Yummy right?"]}
], globalId = "",globalTitle = "", globalIngredients = []; // Define global title and ingredients


// RecipeBook class. This holds all recipes.
var RecipeBook = createReactClass({
  render: function() {
    return (
      <div>
        <Accordion>
          {this.props.data}
        </Accordion>
      </div>
    );
  }
});

// Recipe class. This is the display for a recipe in RecipeBook
var Recipe = createReactClass({
  remove: function() {
    recipes.splice(this.props.index, 1);
    for (var i = 1; i <= recipes.length; i++) {
    	console.log(i);
      	recipes[i-1].id = i;
    }
    update();
  },
  edit: function() {
  	globalId = this.props.index,
    globalTitle = this.props.title;
    globalIngredients = this.props.ingredients;
    document.getElementById("show").click();
  },
  render: function() {
    return (
      <div>
        <h4 className="text-center">Ingredients</h4><hr/>
        <IngredientList ingredients={this.props.ingredients} />
        <ButtonToolbar>
          <Button className="delete" bsStyle="danger" id={"btn-del"+this.props.index} onClick={this.remove}>Delete</Button>
          <Button bsStyle="default" id={"btn-edit"+this.props.index} onClick={this.edit}>Edit</Button>
        </ButtonToolbar>
      </div>
    );
  }
});

// IngredientList class. This lists all ingredients for a Recipe
var IngredientList = createReactClass({

  render: function() {

    var ingredientList = this.props.ingredients.map(function(ingredient,i) {
      return (
        <ListGroupItem key={i}>
          {ingredient}
        </ListGroupItem>
      );
    });
    return (
      <ListGroup>
      {ingredientList}
      </ListGroup>
    );
  },
});

// RecipeAdd class. This contains the Modal and Add Recipe button
var RecipeAdd = createReactClass({
  getInitialState: function() {
    return { showModal: false };
  },
  close: function() {
    globalTitle = "";
    globalId = "";
    globalIngredients = [];
    this.setState({ showModal: false });
  },
  open: function() {
    this.setState({ showModal: true });
    if (document.getElementById("title") && document.getElementById("ingredients")) {
     	document.getElementById("title").value = globalTitle;
      	document.getElementById("ingredients").value = globalIngredients;
      	if (globalTitle !== "") {
        document.getElementById("modalTitle").innerText = "Edit Recipe";
        document.getElementById("addButton").innerText = "Edit Recipe";
      }
    }
    else requestAnimationFrame(this.open);
  },
  add: function() {
    var title = document.getElementById("title").value;
    var id = globalId;
    var ingredients = document.getElementById("ingredients").value.split(",");
    var exists = false;
    
    for (var i = 0; i < recipes.length; i++) {

      if (recipes[i].id === id+1) {
      	recipes[i].title = title;
        recipes[i].ingredients = ingredients;
        exists = true;
        break;
      }
    }
    if (!exists) {
      if (title.length < 1) title = "Untitled";
      recipes.push({id:recipes.length+1,title: title, ingredients: document.getElementById("ingredients").value.split(",")});
    }
    update();
    this.close();
  },
  render: function() {
    return (
      <div>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={this.open}
          id="show"
        >
          Add Recipe
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Add a Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           <form>
	        <FormGroup  controlId="title">
	          <ControlLabel>Recipe Name</ControlLabel>
	          <FormControl type="text"  placeholder="Recipe Name"/>
	        </FormGroup>
	        <FormGroup  controlId="ingredients">
	          <ControlLabel>Enter Ingredients Separated By Commas</ControlLabel>
	          <FormControl type="textarea"  placeholder="Enter Ingredients Separated By Commas"/>
	        </FormGroup>
	      </form>
            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.add} bsStyle="primary" id="addButton">Add Recipe</Button>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

// Update function to display all the recipes
function update() {
  localStorage.setItem("recipeBook", JSON.stringify(recipes));
  var rows = [];
  for (var i=0; i < recipes.length; i++) {
    rows.push(
      <Panel header={recipes[i].title} key={i} eventKey={i} bsStyle="success">
        <Recipe title={recipes[i].title} ingredients={recipes[i].ingredients} index={i}/>
      </Panel>
    );
  }
  ReactDOM.render(<RecipeBook data={rows}/>, document.getElementById("container"));
}
// Filter List
var FilteredList = createReactClass({ 
	filterlist: function() {
    	var rows = [];
  		for (var i=0; i < recipes.length; i++) {
  			console.log(recipes[i].title.startsWith(document.getElementById("filter").value));
  			if(recipes[i].title.toUpperCase().startsWith(document.getElementById("filter").value.toUpperCase())){
  				rows.push(
      				<Panel header={recipes[i].title} key={i} eventKey={i} bsStyle="success">
        				<Recipe title={recipes[i].title} ingredients={recipes[i].ingredients} index={i}/>
     				</Panel>
    			);
  			}
  		}
    	ReactDOM.render(<RecipeBook data={rows}/>, document.getElementById("container"));
  	},
  render: function() {
  	 return(<FormGroup  controlId="filter">
      <ControlLabel>Filter:</ControlLabel>
      <FormControl type="text"  placeholder="Filter" onChange={this.filterlist}/>
    </FormGroup>);
  }
  
 
});
// Filter
function filter(){
	
    ReactDOM.render(<FilteredList/>, document.getElementById("searchbox"));
}

// Render the add button (and modal)
ReactDOM.render(<RecipeAdd/>, document.getElementById("button"));
update(); // Initially render the recipe book
filter();