import React from 'react';

const orderSummary = (props) => {
  const ingredientSummary = Object.keys(props.ingredients);
  return (
    <React.Fragment>
      <h3>Tyour Order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>
        { ingredientSummary.map((igKey, i) => {
            return (
              <li key={igKey + i}>
                <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {props.ingredients[igKey]}
              </li>);
          })
        }
      </ul>
      <p>Continue to Checkout?</p>
    </React.Fragment>
  );
};

export default orderSummary;