import React, { Component } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderySummary/OrderySummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionType from '../../store/actions';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
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
    const oldCount = this.props.ings[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.props.ings
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.props.ings[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.props.ings
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
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + this.createQueryString()
    });
  }

  createQueryString = () => {
    const queryParams = [];

    for ( const ingredient in this.props.ings) {
      queryParams.push(encodeURIComponent(ingredient) + '=' + encodeURIComponent(this.props.ings[ingredient]));
    }

    queryParams.push('price=' + this.state.totalPrice);

    return queryParams.join('&');
  }

  componentDidMount() {
    // axios.get('https://react-redux-burger-1.firebaseio.com/ingredients.json')
    //   .then(res => {
    //     this.setState({ ingredients: res.data });
    //   })
    //   .catch(error => {
    //     this.setState({ error: true });
    //   })
  }

  render () {
    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    return (
      <React.Fragment>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {!this.state.loading && this.props.ings
            ? <OrderSummary
                price={this.state.totalPrice}
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />
            : <Spinner />
          }
        </Modal>
        { this.props.ings
            ? <React.Fragment>
                <Burger ingredients={this.props.ings}/>
                <BuildControls
                  ingredientsAdded={this.props.onIngredientAdded}
                  ingredientsRemoved={this.props.onIngredientRemoved}
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionType.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({type: actionType.REMOVE_INGREDIENT, ingredientName: ingName}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));