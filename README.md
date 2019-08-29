# react-paypal-express-checkout
React component that renders Paypal's express check out button

## Install

```bash
npm install --save react-paypal-express-checkout
```

or
 ```bash
yarn add react-paypal-express-checkout
```

## Usage

## Simplest Example (with minimum set of parameters, this will use the "sandbox" environment)

```javascript
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default class MyApp extends React.Component {
	render() {
		const client = {
			sandbox:    'Your-Sandbox-Client-ID',
			production: 'Your-Production-Client-ID',
		}
        return (
            <PaypalExpressBtn client={client} currency={'USD'} total={1.00} />
        );
    }
}
```

### Full Example

```javascript
import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default class MyApp extends React.Component {
    render() {
		const onSuccess = (payment) => {
			// 1, 2, and ... Poof! You made it, everything's fine and dandy!
            		console.log("Payment successful!", payment);
            		// You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
		}

		const onCancel = (data) => {
			// The user pressed "cancel" or closed the PayPal popup
			console.log('Payment cancelled!', data);
			// You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
		}

		const onError = (err) => {
			// The main Paypal script could not be loaded or something blocked the script from loading
			console.log("Error!", err);
			// Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
			// => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
		}

		let env = 'sandbox'; // you can set this string to 'production'
		let currency = 'USD'; // you can set this string from your props or state  
		let total = 1;  // this is the total amount (based on currency) to charge
		// Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

		const client = {
			sandbox:    'YOUR-SANDBOX-APP-ID',
			production: 'YOUR-PRODUCTION-APP-ID',
		}
		// In order to get production's app-ID, you will have to send your app to Paypal for approval first
		// For your sandbox Client-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App" unless you have already done so):
		//   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
		// Note: IGNORE the Sandbox test AppID - this is ONLY for Adaptive APIs, NOT REST APIs)
		// For production app-ID:
		//   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

		// NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
        return (
            <PaypalExpressBtn env={env} client={client} currency={currency} total={total} onError={onError} onSuccess={onSuccess} onCancel={onCancel} />
        );
    }
}
```

### Props

- `env: String (default: "sandbox")` - You can set this to "production" for production
- `client: Object (with "sandbox" and "production" as keys)` - MUST set, please see the above example
- `currency: String ("USD", "JPY" etc.)` - MUST set, please see the above example
- `total: Number (1.00 or 1 - depends on currency)` - MUST set, please see the above example
- `shipping: Number (0 or 1 or 2)` - Ability to change if a shipping address is included in checkout, 0 is default and means optional, 1 is no shipping address, 2 is shipping is required
- `onError: Callback function (happens when Paypal's main script cannot be loaded)` - If not set, this will take the above function (in example) as a default return
- `onSuccess: Callback function (happens after payment has been finished successfully)` - If not set, this will take the above function (in example) as a default return
- `onCancel: Callback function (happens when users press "cancel" or close Paypal's popup)` - If not set, this will take the above function (in example) as a default return
- `paymentOptions: (optional) enable many options: full "transactions" object and also "note_to_payer", "redirect_urls", "intent" etc.` - https://developer.paypal.com/docs/integration/direct/payments/authorize-and-capture-payments/#authorize-the-payment
https://developer.paypal.com/docs/api/payments/v1/

- `style: (optional) change appearance of Paypal button based on their document: size, color, shape, label` - https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/customize-button/

## Sample Returned Data

- `onSuccess` - the returned `payment` object will look like:
	+ `{paid: true, cancelled: false, payerID: "H8S4CU73PFRAG", paymentID: "PAY-47J75876PA321622TLESPATA", paymentToken: "EC-8FE085188N269774L", returnUrl: "https://www.sandbox.paypal.com/?paymentId=PAY-47J75876PA321622TLESPATA&token=EC-8FE085188N269774L&PayerID=H8S4CU73PFRAG"}`
- `onCancel` - the returned `data` object will look like:
	+ `{paymentToken: "EC-42A825696K839141X", cancelUrl: "https://www.sandbox.paypal.com?token=EC-42A825696K839141X"}`

### Reference Document on How to Have Paypal's Developer Account and Merchant + Buyer accounts

- In fact, please just go to Paypal's developer page, login with your "Real" Paypal account:
	+ Click on the "Sandbox accounts" on the left hand side
	+ You will see Merchant + Buyer accounts have been created automatically
	+ You can then change password, profile, can also clone those accounts, or create more accounts (choose country, default currency, set amount for new accounts)
- You can check balance & transaction history of those testing accounts (the same as real accounts)	by login with the accounts' credentials with:
	+ https://www.sandbox.paypal.com/
- Official documents here: (just be patient and go step-by-step, by clicking their next topic's button on page, you can then understand the whole process!)
	+ https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/create_payment_button/

## TODO

- Upgrade this library into more advanced Paypal button library (with features like recurring, add-to-cart, checkout-now etc.)
- Fork & pull-request are very welcomed!

## Thank you

- [React NPM Boilerplate](https://github.com/juliancwirko/react-npm-boilerplate)

## License

MIT
