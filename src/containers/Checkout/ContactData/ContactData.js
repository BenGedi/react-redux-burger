import React, { Component } from 'react';
import { connect } from 'react-redux';
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
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Street'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP CODE'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest'},
                        { value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: ''
            }
        },
        loading: false
    }

    orderHandler = (event) => {
        // disable default rerendering after click event
        event.preventDefault();
        this.setState({ loading: true });

        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
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

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {...this.state.orderForm};
        const updatedFromElement = {...updatedOrderForm[inputIdentifier]};
        updatedFromElement.value = event.target.value;
        updatedOrderForm[inputIdentifier] = updatedFromElement;
        this.setState({orderForm: updatedOrderForm});
    }

    render() {
        const fromElementsArray = [];
        for (const key in this.state.orderForm) {
            fromElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {   !this.state.loading
                    ? <form action="">
                        {fromElementsArray.map(formElement => (
                            <Input
                                key={formElement.id}
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                value={formElement.config.value}
                                changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
                        ))

                        }
                        <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
                    </form>
                    : <Spinner/>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
};

export default connect(mapStateToProps)(ContactData);