import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elemenetConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elemenetConfig: {
                    type: 'text',
                    placeholder: 'Your Street'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elemenetConfig: {
                    type: 'text',
                    placeholder: 'ZIP CODE'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elemenetConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elemenetConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elemenetConfig: {
                    option: [
                        { value: 'fastest', displayValue: 'Fastest'},
                        { value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: ''
            },
            street: 'Moshe Sharet 65',
            zipCode: '45202',
            country: 'Israel',
            email: 'bengedi@gmail.com',
            deliveryMethod: 'fastest'
        },
        loading: false
    }

    orderHandler = (event) => {
        // disable default rerendering after click event
        event.preventDefault();
        
        this.setState({ loading: true });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
        };
        // from using firebase we need to add suffix ".json" to the endpoint
        axios.post('/orders.json', order)
        .then(res => {
            this.setState({ loading: false });
            this.props.history.push('/');
        })
        .catch(error => {
            this.setState({ loading: false });
        });
    }

    render() {
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {   !this.state.loading 
                    ? <form action="">
                        <Input elemenetType="" elemenetConfig="" value=""/>
                        <Input inputtype="input" type="email" name="email" placeholder="Your Email"/>
                        <Input inputtype="input" type="text" name="street" placeholder="Street"/>
                        <Input inputtype="input" type="text" name="postalCode" placeholder="Postal Code"/>
                        <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
                    </form>
                    : <Spinner/> 
                }
            </div>
        )
    }
}

export default ContactData;