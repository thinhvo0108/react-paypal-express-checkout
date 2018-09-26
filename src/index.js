import React from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import PropTypes from 'prop-types';

class PaypalButton extends React.Component {
    constructor(props) {
        super(props);
        window.React = React;
        window.ReactDOM = ReactDOM;
        this.state = {
            showButton: false
        }
    }

    componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
        if (!this.state.show) {
            if (isScriptLoaded && !this.props.isScriptLoaded) {
                if (isScriptLoadSucceed) {
                    this.setState({ showButton: true });
                } else {
                    console.log('Cannot load Paypal script!');
                    this.props.onError();
                }
            }
        }
    }

    componentDidMount() {
        const { isScriptLoaded, isScriptLoadSucceed } = this.props;
        if (isScriptLoaded && isScriptLoadSucceed) {
            this.setState({ showButton: true });
        }
    }

    render() {
        let payment = () => {
            return paypal.rest.payment.create(this.props.env, this.props.client, Object.assign({
                transactions: [
                    { amount: { total: this.props.total, currency: this.props.currency } }
                ]
            }, this.props.paymentOptions), {
                input_fields: {
                    // any values other than null, and the address is not returned after payment execution.
                    no_shipping: this.props.shipping
                }
            });
        }

        const onAuthorize = (data, actions) => {
            return actions.payment.execute().then((payment_data) => {
                // console.log(`payment_data: ${JSON.stringify(payment_data, null, 1)}`)
                const payment = Object.assign({}, this.props.payment);
                payment.paid = true;
                payment.cancelled = false;
                payment.payerID = data.payerID;
                payment.paymentID = data.paymentID;
                payment.paymentToken = data.paymentToken;
                payment.returnUrl = data.returnUrl;
                // getting buyer's shipping address and email
                payment.address = payment_data.payer.payer_info.shipping_address;
                payment.email = payment_data.payer.payer_info.email;
                this.props.onSuccess(payment);
            })
        }

        let ppbtn = '';
        if (this.state.showButton) {
            ppbtn = <paypal.Button.react
                env={this.props.env}
                client={this.props.client}
                style={this.props.style}
                payment={payment}
                commit={true}
                onAuthorize={onAuthorize}
                onCancel={this.props.onCancel}

                // "Error: Unrecognized prop: shipping" was caused by the next line
                // shipping={this.props.shipping}
            />
        }
        return <div>{ppbtn}</div>;
    }
}

PaypalButton.propTypes = {
    currency: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    client: PropTypes.object.isRequired,
    style: PropTypes.object
}

PaypalButton.defaultProps = {
    paymentOptions: {},
    env: 'sandbox',
    // null means buyer address is returned in the payment execution response
    shipping: null,
    onSuccess: (payment) => {
        console.log('The payment was succeeded!', payment);
    },
    onCancel: (data) => {
        console.log('The payment was cancelled!', data)
    },
    onError: (err) => {
        console.log('Error loading Paypal script!', err)
    }
};

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);
