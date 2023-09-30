// This part was commented out because the free API request was disabled by the host

// document.addEventListener('DOMContentLoaded', function() {
//     // Every time user visit this page, the local storage rate turn back to 1 as 1VND=1VND
//     localStorage.setItem('rate', 1);

//     // Get the website that provide exchange rate
//     const exchange_rate_source = 'https://api.exchangerate.host/latest?base=VND';
//     document.querySelector('#currency').onchange = function() {
//         fetch(exchange_rate_source)
//         .then(response => response.json())
//         .then(data => {
//             // Get the rate from option value in select dropdown choice
//             const rate = data.rates[this.value];

//             // Get the rate from previous selected option
//             const old_rate = localStorage.getItem('rate');

//             // For every price, exchange it to new currency
//             document.querySelectorAll('.price').forEach(strong => {
//                 let default_price = parseFloat(strong.getAttribute('data-price'));

//                 // If the currency is VND, toFixed(0), other toFixed(2)
//                 if (this.value === 'VND') {
//                     fractional_part = 0;
//                 } else {
//                     fractional_part = 2;
//                 }
//                 new_price = (default_price*rate/old_rate).toFixed(fractional_part);
//                 strong.innerHTML = numberWithCommas(new_price);
//                 strong.setAttribute('data-price', new_price);
//             })

//             // Change currency at the price to the choice of user
//             document.querySelectorAll('.price-currency').forEach(strong => {
//                 strong.innerHTML = this.value;
//             })

//             // Record the last rate value
//             localStorage.setItem('rate', rate);
//         })
//         .catch(error => {
//             console.log('Error: ', error);
//         })
//     }    
// })

// // Add commas separator to every group of 3 digit
// function numberWithCommas(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }