import React, { Component } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderySummary/OrderySummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasing: false,
    purchasable: false,
    loading: false,
    error: false
  };

  updatePurchaseState (ingredients) {
    const sum = Object.values(ingredients)
      .reduce((sum, currentValue) => {
        return sum + currentValue;
      }, 0);

    this.setState({purchasable: sum > 0});
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    // alert('You continue!');
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Ben Gedi',
        address: {
          street: 'Moshe Sharet 65',
          zipCode: '45202',
          country: 'Israel'
        },
        email: 'bengedi@gmail.com'
      },
      deliveryMethod: 'fastest'
    }
    // from using firebase we need to add suffix ".json" to the endpoint
    axios.post('/orders.json', order)
      .then(res => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(error => {
        this.setState({ loading: false, purchasing: false });
      });
  }

  componentDidMount() {
    axios.get('https://react-redux-burger-1.firebaseio.com/ingredients.json')
      .then(res => {
        this.setState({ ingredients: res.data });
      })
      .catch(error => {
        this.setState({ error: true });
      })
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    return (
      <React.Fragment>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {!this.state.loading && this.state.ingredients
            ? <OrderSummary
                price={this.state.totalPrice}
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />
            : <Spinner />
          }
        </Modal>
        { this.state.ingredients
            ? <React.Fragment>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                  ingredientsAdded={this.addIngredientHandler}
                  ingredientsRemoved={this.removeIngredientHandler}
                  disabled={disabledInfo}
                  purchasable={this.state.purchasable}
                  ordered={this.purchaseHandler}
                  price={this.state.totalPrice} />
            </React.Fragment>
            : !this.state.error ? <Spinner /> : <p>Ingredients can't be loaded</p>
        }
      </React.Fragment>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);