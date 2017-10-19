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
            const transaction = {
                amount: { total: this.props.total, currency: this.props.currency }
            };

            if (this.props.custom) {
                transaction.custom = this.props.custom;
            }

            if (this.props.invoice_number) {
                transaction.invoice_number = this.props.invoice_number;
            }

            return paypal.rest.payment.create(this.props.env, this.props.client, {
                transactions: [transaction]
            }, {
                input_fields: {
                    no_shipping: this.props.shipping
                }
            });
        }

        const onAuthorize = (data, actions) => {
            return actions.payment.execute().then(() => {
                const payment = Object.assign({}, this.props.payment);
                payment.paid = true;
                payment.cancelled = false;
                payment.payerID = data.payerID;
                payment.paymentID = data.paymentID;
                payment.paymentToken = data.paymentToken;
                payment.returnUrl = data.returnUrl;
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
                shipping={this.props.shipping}
                onAuthorize={onAuthorize}
                onCancel={this.props.onCancel}
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
    env: 'sandbox',
    shipping: 0,
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
