
var dictionary = ["cat", "bat", "rat", "apples", "bananas", "Apples", "Oranges",
"Cherries", "Cranberries", "Grapes", "Grapefruit", "Pears", "Pomegranates",
"Raspberries", "Strawberries", "Watermelon", "Cauliflower", "Garlic", "Ginger", "Jerusalem", "Artichokes", "Jicama", "Kohlrabi", "Mushrooms",
"Onions", "Parsnips", "Potatoes", "Turnips", "Corn","Radish"]; //consdering dictionary array as the sample dictionary on which the randomizer works.can take bigger data sets
var length=dictionary.length; //storing value of dictionary array length

function Randomizer(inputUserName) {
  /*This function takesin username input and returns an array of possible username suggestions.
  function randomly appends a value from the dictionar array to userinput in such a way that the random values do not repeat
  (unless all the values are used which resets the array)
  Fucntion also randomly appends a number from 0-9999 to userinput once in three times
  Function can also ramdomappending i.e appending at the beining/end of the userinput*/
  var resultArray=[];//stores all values can be possible username suggestions for the user
  for(var i=0;i<3;i++){// runs from 1 to 3 but can increase 3 to any larger number if we want more number returned in an array
    // count of 3 implemented just to show functioning . can be changed in order to increase performance
    var randomAppender = Math.floor((Math.random() * (10)));//stores random value from 0-9999
  if (length > 0) {

    var random = Math.floor((Math.random() * (length - 1)));//generatin random index of the dictionary array

    if(i==1){
    resultArray.push(inputUserName+dictionary[random] + Math.floor(Math.random()*9999));//username suggestion containing numbers at the end
    }
    else{
      //randomly append at the front/back of the inputvalue
        if(randomAppender<5){
          resultArray.push(inputUserName + dictionary[random]);//pushing values to array
        }
        else{
          resultArray.push(dictionary[random] + inputUserName);
        }

    }
    /*swapping picked value of dicitonary array with the last value of the array
    This is done to make sure random values are not repeated*/
    var temp = dictionary[random];
    dictionary[random] = dictionary[length - 1];
    dictionary[length - 1] = temp;
    length--;

    }
    if(length==0){
      //In case all the random values were picked atleast once then reseting the length of the array
      length=dictionary.length;
    }
  }
  return resultArray;//returing possible list of suggested usernames
}

function validation(inputtext) {
  //validation function is used to check if the input's' is empty or contains charcters other than alphnumeric and returns boolean value
  $("#alphanumeric-alert").hide();

  if(inputtext=="") {
//returns false on empty input value
    $("#alphanumeric-alert").show();//display the alert div
    $("#validator-message").html("Please enter username to get started");//appends error message to the alert div
    return false;
  }

  var alphaNumericExp = /^[0-9a-zA-Z ]+$/;  //using regular expression to check for alphanumeric charcters
  if(alphaNumericExp.test(inputtext)) {
     return true;
  }
  else {
    //if userinput contains characters other than user input then show error message
    $("#alphanumeric-alert").show();//display the alert div
    $("#validator-message").html("Please enter only alphanumeric characters");//appends error message to the alert div
    return false;
  }
}

function success(data,resultArray,appendValue,inputValue,appendValue1){

  dataTemp = data; // storing the value in a Temporary global variable each time the succes is called
  $("#loader").hide();

  if(hasValue(inputValue,data)) {
    // if users input is found in response object this means user is already regiested
    $("#success").hide();
    $("#danger").show();
    /*generating suggested usernames and storing them to finalArray
    if all values in the array reciecved from Randomizer are not regiested users then finalarray is populated
    if few users are already registered then while loop runs until the Finalarray has 3 values
    each time 3 values are possible usernames are checked to see if they match regustered usernames or not
    MINIMIZING NUMBER OF AJAX REQUESTS BY APPENDING ALL THE POSSIBLE USERNAME VALUES TO THE URL (COMMA SEPERATED) AND GETTING RESPONSE OBJECT FOR
    ALL OF THEM AT ONCE INSTEAD OF CHECKING FOR EACH PARTICULAR USERnAME*/
    while(finalArray.length<3){

      hitOrMiss(resultArray,dataTemp); //checks to see if resulktantarray is present is most recent response object
      resultArray = Randomizer(inputValue);//generating new possible username values
      appendValue = appender(appendValue1,resultArray);// appendng possible username values to url
      $.ajax(appendValue).done(function(data) {
        //storing response object for performing operations in next iteration
        dataTemp = data;
        });

    }
    var suggestionClasses = document.getElementsByClassName("suggestion");//collection if all divs with this classname
    //display valid usernames to the user
    for(var i=0;i<finalArray.length;i++){
      suggestionClasses[i].innerHTML = finalArray[i];// poplating values in the divs to display to user
    }


  }
  else{
  /*if the user's input is not present in the response that means user is not regiested
  //display success message saying username be used*/
      $("#danger").hide();
      $("#success").show();
  }
}
function hasValue(value,arr) {
  //Function to check if a value is present in an array of objects and returns boolean value accordingly
  for (var i=0; i < arr.length; i++) {
    if (arr[i].username === value) {
      //if value is present return true
        return true;
      }
  }
  return false; // false if not present in object
}

function appender(str,arr) {
/*Function to append url to mutliple usernames
  used to generate the ajax url value*/
  for(var i=0;i<arr.length;i++){
    str=str + "," + arr[i]; // appending url to all possible suggested usernames
  }
  return str;
}

function hitOrMiss(arr,data) {
/*Function that adds suggested usernames to display , to the array finalArray
  adds the values if username is not present in the data object of ajax response*/
  for(var i=0;i<arr.length;i++) {

      if(!hasValue(arr[i],data)) {
        finalArray.push(arr[i]); //pushing the value to array if value not present
      }

      if(finalArray.length>=3) {
        /*breaks the lopp if we get 3 valid suggestions fro the user
        since we have to dispay only 3 values*/
        break;
      }
  }
  return finalArray;//returns the resultant array
}
