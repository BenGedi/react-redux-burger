import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BugerBuilder';
import Checkout from './containers/Checkout/Checkout';
import { Route, Switch } from 'react-router-dom';

class App extends Component {
    render() {

        /**
         * The Switch in this case is not necessary, cus' it will render only one route 
         * the exact makes the route path to match only the Root path
         * the order of the routes in this case is not important because we are using the "exact" property and the Switch component (which is persent only one route at at time)
         *  */
        return (
            <div>
                <Layout>
                    <Switch>
                        <Route path="/checkout" component={Checkout}/>
                        <Route path="/" exact component={BurgerBuilder}/>
                    </Switch>
                </Layout>
            </div>
        );
    }
}

export default App;
