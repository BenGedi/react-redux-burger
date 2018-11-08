import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
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
                        <Input inputtype="input" type="text" name="name" placeholder="Your Name"/>
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