function signup() {

  const pasregx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm
  const emailregx = /^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm
  const phoneregx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  const nameregx = /^[a-zA-Z][a-zA-Z0-9_]{3,16}$/i


  const username = document.signupform.userName.value
  const phone = document.signupform.phone.value
  const email = document.signupform.email.value
  const password = document.signupform.password.value
  const repassword = document.signupform.rePassword.value

  if (username == "" && phone == "" && email == "" && password == "" && repassword == "") {
    document.getElementById("signerr").innerHTML = "All fields are required"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (username == "") {
    document.getElementById("signerr").innerHTML = "Username field is required"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (nameregx.test(username) == false) {
    document.getElementById("signerr").innerHTML = "Invalid username format"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (phone == "") {
    document.getElementById("signerr").innerHTML = "Phone-Number field is required"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (phoneregx.test(phone) == false) {
    document.getElementById("signerr").innerHTML = "Phone-Number is  invalid"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (email == "") {
    document.getElementById("signerr").innerHTML = "Email field is required"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (emailregx.test(email) == false) {
    document.getElementById('signerr').innerHTML = "Email is invalid"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (password == "") {
    document.getElementById("signerr").innerHTML = "Password field is required"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (pasregx.test(password) == false) {
    document.getElementById('signerr').innerHTML = "Password should contain 8 charecters,atleast 1 Uppercase and 1 Number"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (repassword == "") {
    document.getElementById("signerr").innerHTML = "Re-Password field is required"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  if (repassword !== password) {
    document.getElementById('signerr').innerHTML = "Confirm Password does not match"
    setTimeout(() => {
      document.getElementById('signerr').innerHTML = ""
    }, 3000);
    return false
  }
  return true
}

function login() {

  const email = document.loginform.email.value
  const password = document.loginform.password.value

  const emailregx = /^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm
  const pasregx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm

  if (email == "" && password == "") {
    document.getElementById('error').innerHTML = "All fields are required"
    return false
  }
  if (email == "") {
    document.getElementById('error').innerHTML = "Email field is required"
    return false
  }
  if (emailregx.test(email) == false) {
    document.getElementById('error').innerHTML = "Email is invalid format"
    return false
  }
  if (password == "") {
    document.getElementById('error').innerHTML = "Password field is required"
    return false
  }
  if (pasregx.test(password) == false) {
    document.getElementById('error').innerHTML = "Password is invalid format"
    return false
  }

  return true
}

function adminlogin() {

  const emailregx = /^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm
  const pasregx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm

  const adminemail = document.adminform.adminEmail.value
  const adminpassword = document.adminform.adminPassword.value

  if (adminemail == "" && adminpassword == "") {
    document.getElementById('admerr').innerHTML = "All fields are required"
    return false
  }
  if (adminemail == "") {
    document.getElementById('admerr').innerHTML = "Email field is required"
    return false
  }
  if (emailregx.test(adminemail) == false) {
    document.getElementById('admerr').innerHTML = "Email is invalid format"
    return false
  }
  if (adminpassword == "") {
    document.getElementById('admerr').innerHTML = "Password field is required"
    return false
  }
  if (pasregx.test(adminpassword) == false) {
    document.getElementById('admerr').innerHTML = "Password is invalid format"
    return false
  }
  return true

}

function otplogin() {
  const emailregx = /^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm

  const email = document.otpform.otpEmail.value

  if (email == "") {
    document.getElementById('otperr').innerHTML = "Email field is required to your OTP"
    return false
  }
  if (emailregx.test(email) == false) {
    document.getElementById('otperr').innerHTML = "Email is invalid format"
    return false
  }
  return true
}

function placeOrder() {

  const fname = document.myForm.c_fname.value
  const lname = document.myForm.c_lname.value
  const state = document.myForm.c_state.value
  const district = document.myForm.c_district.value
  const address = document.myForm.c_address.value
  const pin = document.myForm.c_pin.value
  const country = document.myForm.c_country.value
  const phone = document.myForm.c_phone.value
  const email = document.myForm.c_email.value
  const method = document.myForm.c_payment.value



  const nameRegx = /^[a-zA-Z][a-zA-Z]{3,16}$/i
  const lnameRegx = /^[a-zA-Z][a-zA-Z]{1,16}$/i
  const pinRegx = /^([0-9]){6}$/gm
  const phoneregex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  const EmailRegx = /^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm

  if (fname == '' && lname == '' && district == '' && address == '' && pin == '' && phone == '' && email == '' && country == '') {
    document.getElementById('placeOrderErr').innerHTML = "All fields are reqired"
    return false
  }
  if (country == '') {
    document.getElementById('placeOrderErr').innerHTML = "Country field is required"
    return false
  }
  if (nameRegx.test(country) == false) {
    document.getElementById('placeOrderErr').innerHTML = "Enter valid country"
    return false
  }
  if (fname == '') {
    document.getElementById('placeOrderErr').innerHTML = "Firstname field reqired"
    return false
  }

  if (nameRegx.test(fname) == false) {
    document.getElementById('placeOrderErr').innerHTML = "Firstname only allows characters and length should atleast 4 characters"
    return false
  }
  if (lname == '') {
    document.getElementById('placeOrderErr').innerHTML = "Lastname field reqired"
    return false
  }
  if (lnameRegx.test(lname) == false) {
    document.getElementById('placeOrderErr').innerHTML = "lastname only allows characters and length should atleast 4 characters"
    return false
  }
  if (state == '') {
    document.getElementById('placeOrderErr').innerHTML = "State feild is required"
    return false
  }
  if (nameRegx.test(state) == false) {
    document.getElementById('placeOrderErr').innerHTML = "Enter valid State"
    return false
  }

  if (district == '') {
    document.getElementById('placeOrderErr').innerHTML = "District feild is required"
    return false
  }
  if (nameRegx.test(district) == false) {
    document.getElementById('placeOrderErr').innerHTML = "Enter valid District"
    return false
  }
  if (pin == '') {
    document.getElementById('placeOrderErr').innerHTML = "Pincode field is empty"
    return false
  }

  if (pinRegx.test(pin) == false) {
    document.getElementById('placeOrderErr').innerHTML = "Invalid Pincode"
    return false
  }
  if (phone == '') {
    document.getElementById('placeOrderErr').innerHTML = "Phone number field is required"
    return false
  }
  if (phoneregex.test(phone) == false) {
    document.getElementById('placeOrderErr').innerHTML = "Invalid Phone Number"
    return false
  }
  if (address == '') {
    document.getElementById('placeOrderErr').innerHTML = "Address field required"
    return false
  }
  if (address.length < 8) {
    document.getElementById('placeOrderErr').innerHTML = "Enter a valid address"
    return false
  }

  if (email == '') {
    document.getElementById('placeOrderErr').innerHTML = "Phone number field is required"
    return false
  }
  if (EmailRegx.test(email) == false) {
    document.getElementById('placeOrderErr').innerHTML = "Invalid Email address"
    return false
  }
  if (method == '') {
    document.getElementById('placeOrderErr').innerHTML = "Select a payment method"
    return false
  }
  return true
}

function couponValidate() {

  const nameRegx = /^[a-zA-Z0-9]{3,16}$/i
  const numberregx = /^[0-9]{1,6}$/
  const discountregx = /^[0-9]{1,2}$/

  const name = document.coupon_form.c_name.value
  const price = document.coupon_form.c_price.value
  const date = document.coupon_form.c_date.value
  const discount = document.coupon_form.c_discount.value

  if (name == "" && price == "" && date == "" && discount == "") {
    document.getElementById('addserrer').innerHTML = "All feilds are required"
    setTimeout(() => {
      document.getElementById('addserrer').innerHTML = ""
    }, 2000);
    return false
  }
  if (name == "") {
    document.getElementById('addserrer').innerHTML = "Name is feild required"
    setTimeout(() => {
      document.getElementById('addserrer').innerHTML = ""
    }, 2000);
    return false
  }
  if (nameRegx.test(name) == false) {
    return false
  }
  if (date == "") {
    document.getElementById('addserrer').innerHTML = "Date is feild required"
    setTimeout(() => {
      document.getElementById('addserrer').innerHTML = ""
    }, 2000);
    return false
  }
  if (price == "") {
    document.getElementById('addserrer').innerHTML = "Price is feild required"
    setTimeout(() => {
      document.getElementById('addserrer').innerHTML = ""
    }, 2000);
    return false
  }
  if (numberregx.test(price) == false) {
    document.getElementById('addserrer').innerHTML = "Price is invalid format"
    setTimeout(() => {
      document.getElementById('addserrer').innerHTML = ""
    }, 2000);
    return false
  }
  if (discount == "") {
    document.getElementById('addserrer').innerHTML = "Discount is feild required"
    setTimeout(() => {
      document.getElementById('addserrer').innerHTML = ""
    }, 2000);
    return false
  }
  if (discountregx.test(discount) == false) {
    document.getElementById('addserrer').innerHTML = "Enter discount in valid format"
    setTimeout(() => {
      document.getElementById('addserrer').innerHTML = ""
    }, 2000);
    return false
  }
  return true
}


function bannerValidate() {
  const textregx = /^[a-zA-Z0-9\s+'\-& ]{2,}$/i
  const text = document.banner_form.main_text.value
  if (text == '') {
    document.getElementById('addserrer').innerHTML = 'Main Text cannot be empty'
    setTimeout(() => {
      document.getElementById('addserrer').innerHTML = ''
    }, 2000);
    return false
  }
  if (textregx.test(text) == false) {
    document.getElementById('addserrer').innerHTML = 'Main Text is invalid format'
    setTimeout(() => {
      document.getElementById('addserrer').innerHTML = ''
    }, 2000);
    return false
  }
  return true
}