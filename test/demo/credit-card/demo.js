/* eslint-env browser */

/**
 * Invokes PaymentRequest for credit cards.
 */
function onBuyClicked() {
  const supportedInstruments = [{
    supportedMethods: ['amex', 'diners', 'discover', 'jcb', 'mastercard',
        'unionpay', 'visa'],
  }];

  const details = {
    total: {label: 'Donation', amount: {currency: 'USD', value: '55.00'}},
    displayItems: [
      {
        label: 'Original donation amount',
        amount: {currency: 'USD', value: '65.00'},
      },
      {
        label: 'Friends and family discount',
        amount: {currency: 'USD', value: '-10.00'},
      },
    ],
  };

  new PaymentRequest(supportedInstruments, details) // eslint-disable-line no-undef
      .show()
      .then(function(instrumentResponse) {
        sendPaymentToServer(instrumentResponse);
      })
      .catch(function(err) {
        console.error(err);
      });
}

/**
 * Simulates processing the payment data on the server.
 *
 * @param {PaymentResponse} instrumentResponse The payment information to
 * process.
 */
function sendPaymentToServer(instrumentResponse) {
  // There's no server-side component of these samples. Not transactions are
  // processed and no money exchanged hands. Instantaneous transactions are not
  // realistic. Add a 2 second delay to make it seem more real.
  window.setTimeout(function() {
    instrumentResponse.complete('success')
        .then(function() {
          document.getElementById('result').innerHTML =
              instrumentToJsonString(instrumentResponse);
        })
        .catch(function(err) {
          console.error(err);
        });
  }, 2000);
}

/**
 * Converts the payment instrument into a JSON string.
 *
 * @private
 * @param {PaymentResponse} instrument The instrument to convert.
 * @return {string} The JSON string representation of the instrument.
 */
function instrumentToJsonString(instrument) {
  const details = instrument.details;
  details.cardNumber = 'XXXX-XXXX-XXXX-' + details.cardNumber.substr(12);
  details.cardSecurityCode = '***';

  // PaymentInsrument is an interface, but JSON.stringify works only on
  // dictionaries.
  return JSON.stringify({
    methodName: instrument.methodName,
    details: details,
  }, undefined, 2);
}

const buyButton = document.querySelector('.js-buy-btn');
if ('PaymentRequest' in window) {
  buyButton.disabled = false;
  buyButton.addEventListener('click', onBuyClicked);
} else {
  buyButton.disabled = true;
  buyButton.textContent = 'PaymentRequest API Not Supported';
  console.error('This browser does not support web payments');
}
