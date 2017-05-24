(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'react-dom', 'react-async-script-loader', 'prop-types'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('react-dom'), require('react-async-script-loader'), require('prop-types'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.reactDom, global.reactAsyncScriptLoader, global.propTypes);
        global.index = mod.exports;
    }
})(this, function (exports, _react, _reactDom, _reactAsyncScriptLoader, _propTypes) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _reactAsyncScriptLoader2 = _interopRequireDefault(_reactAsyncScriptLoader);

    var _propTypes2 = _interopRequireDefault(_propTypes);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var PaypalButton = function (_React$Component) {
        _inherits(PaypalButton, _React$Component);

        function PaypalButton(props) {
            _classCallCheck(this, PaypalButton);

            var _this = _possibleConstructorReturn(this, (PaypalButton.__proto__ || Object.getPrototypeOf(PaypalButton)).call(this, props));

            window.React = _react2.default;
            window.ReactDOM = _reactDom2.default;
            _this.state = {
                showButton: false
            };
            return _this;
        }

        _createClass(PaypalButton, [{
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(_ref) {
                var isScriptLoaded = _ref.isScriptLoaded,
                    isScriptLoadSucceed = _ref.isScriptLoadSucceed;

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
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _props = this.props,
                    isScriptLoaded = _props.isScriptLoaded,
                    isScriptLoadSucceed = _props.isScriptLoadSucceed;

                if (isScriptLoaded && isScriptLoadSucceed) {
                    this.setState({ showButton: true });
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this2 = this;

                var payment = function payment() {
                    return paypal.rest.payment.create(_this2.props.env, _this2.props.client, {
                        transactions: [{ amount: { total: _this2.props.total, currency: _this2.props.currency } }]
                    });
                };

                var onAuthorize = function onAuthorize(data, actions) {
                    return actions.payment.execute().then(function () {
                        var payment = Object.assign({}, _this2.props.payment);
                        payment.paid = true;
                        payment.cancelled = false;
                        payment.payerID = data.payerID;
                        payment.paymentID = data.paymentID;
                        payment.paymentToken = data.paymentToken;
                        payment.returnUrl = data.returnUrl;
                        _this2.props.onSuccess(payment);
                    });
                };

                var ppbtn = '';
                if (this.state.showButton) {
                    ppbtn = _react2.default.createElement(paypal.Button.react, {
                        env: this.props.env,
                        client: this.props.client,
                        payment: payment,
                        commit: true,
                        onAuthorize: onAuthorize,
                        onCancel: this.props.onCancel
                    });
                }
                return _react2.default.createElement(
                    'div',
                    null,
                    ppbtn
                );
            }
        }]);

        return PaypalButton;
    }(_react2.default.Component);

    PaypalButton.propTypes = {
        currency: _propTypes2.default.string.isRequired,
        total: _propTypes2.default.number.isRequired,
        client: _propTypes2.default.object.isRequired
    };

    PaypalButton.defaultProps = {
        env: 'sandbox',
        onSuccess: function onSuccess(payment) {
            console.log('The payment was succeeded!', payment);
        },
        onCancel: function onCancel(data) {
            console.log('The payment was cancelled!', data);
        },
        onError: function onError(err) {
            console.log('Error loading Paypal script!', err);
        }
    };

    exports.default = (0, _reactAsyncScriptLoader2.default)('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);
});