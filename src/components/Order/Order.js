import React from 'react';
import classes from './Order.css';

const order = props => {
    const ingredients = [];
    const price = Number(props.price).toFixed(2);

    for (let key in props.ingredients) {
        ingredients.push({
            name: key,
            amount: props.ingredients[key]
        });
    }

    const ingredientsOutput = ingredients.map(ig => {
        return <span key={props.name} style={{
            textTransform: 'capitalize',
            display: 'inline-block',
            margin: '0 8px',
            border: '1px solid black',
            padding: '5px'
        }}>{ig.name} ({ig.amount})</span>
    })
    
    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientsOutput}</p>
            <p>Price: USD {price}</p>
        </div>
    );
}

export default order;
