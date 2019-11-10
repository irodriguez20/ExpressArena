const express = require("express"); //http middleware
const morgan = require("morgan"); // logging middleware

const app = express();
app.use(morgan("dev"));

//examples of how to access request properties and how to accumulate response contents
app.get("/echo", (req, res) => {
  const responseText = `Here are some details of your request: 
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
    `;
  res.send(responseText);
});

app.get("/colors", (req, res) => {
  const colors = [
    {
      name: "red",
      rgb: "FF0000"
    },
    {
      name: "green",
      rgb: "00FF00"
    },
    {
      name: "blue",
      rgb: "0000FF"
    }
  ];
  res.json(colors);
});

app.get("/grade", (req, res) => {
  // get the mark from the query
  const { mark } = req.query;

  // do some validation
  if (!mark) {
    // mark is required
    return res.status(400).send("Please provide a mark");
  }

  const numericMark = parseFloat(mark);
  if (Number.isNaN(numericMark)) {
    // mark must be a number
    return res.status(400).send("Mark must be a numeric value");
  }

  if (numericMark < 0 || numericMark > 100) {
    // mark must be in range 0 to 100
    return res.status(400).send("Mark must be in range 0 to 100");
  }

  if (numericMark >= 90) {
    return res.send("A");
  }

  if (numericMark >= 80) {
    return res.send("B");
  }

  if (numericMark >= 70) {
    return res.send("C");
  }

  res.send("F");
});

app.get("/queryViewer", (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get("/burgers", (req, res) => {
  res.send("We have juicy cheese burgers!");
});

app.get("/pizza/pepperoni", (req, res) => {
  res.send("Pizza in the oven!");
});

app.get("/pizza/pineapple", (req, res) => {
  res.send("We don't serve that here!");
});

app.get("/greetings", (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  if (!name) {
    //3. name was not provided
    return res.status(400).send("Please provide a name");
  }

  if (!race) {
    //3. race was not provided
    return res.status(400).send("Please provide a race");
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response
  res.send(greeting);
});

app.get("/sum", (req, res) => {
  const a = parseInt(req.query.a, 10);
  const b = parseInt(req.query.b, 10);
  const c = a + b;

  if (!a) return res.status(400).send("Please provide a first operand");
  if (!b) return res.status(400).send("Please provide a second operand");
  const result = `The sum of ${a} and ${b} is ${c}.`;
  res.send(result);
});

app.get("/cipher", (req, res) => {
  const text = req.query.text;
  let shift = parseInt(req.query.shift);
  const uncypher = req.query.uncypher;

  if (!text)
    return res.status(404).send("Please provide a text query parameter");

  if (!shift)
    return res.status(404).send("Please provide a shift query parameter");

  //shift = parseInt(shift, 10);
  const result = shiftString(text, shift);
  const responseBody = `The shifted version of "${text}" is "${result}" Is it working.`;
  res.send(responseBody);

  function shiftString(text, shift) {
    return text
      .split("")
      .map(letter => {
        //82 should be z
        let number = letter.charCodeAt(0);
        if (uncypher) {
          return String.fromCharCode(number + shift);
        } else {
          return String.fromCharCode(number - shift);
        }
      })
      .join("");
  }
});

app.get("/lotto", (req, res) => {
  const { numbers } = req.query;

  // validation:
  // 1. the numbers array must exist
  // 2. must be an array
  // 3. must be 6 numbers
  // 4. numbers must be between 1 and 20

  if (!numbers) {
    return res.status(200).send("numbers is required");
  }

  //   if (!Array.isArray(numbers)) {
  //     return res.status(200).send("numbers must be an array");
  //   }

  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  if (guesses.length != 6) {
    return res
      .status(400)
      .send("numbers must contain 6 integers between 1 and 20");
  }

  // fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20)
    .fill(1)
    .map((_, i) => i + 1);

  //randomly choose 6
  const winningNumbers = [];
  for (let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  //compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  switch (diff.length) {
    case 0:
      responseText = "Wow! Unbelievable! You could have won the mega millions!";
      break;
    case 1:
      responseText = "Congratulations! You win $100!";
      break;
    case 2:
      responseText = "Congratulations, you win a free ticket!";
      break;
    default:
      responseText = "Sorry, you lose";
  }

  // uncomment below to see how the results ran

  // res.json({
  //   guesses,
  //   winningNumbers,
  //   diff,
  //   responseText
  // });

  res.send(responseText);
});
app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});
