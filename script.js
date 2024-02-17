// dependencies
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require("langchain/prompts"); // Step 1: Require the PromptTemplate module
const inquirer = require('inquirer');
require('dotenv').config();

// Creates and stores a wrapper for the OpenAI package along with basic configuration
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY, 
  temperature: 0,
  model: 'gpt-3.5-turbo'
});

// Step 2: Instantiate a PromptTemplate object
const prompt = new PromptTemplate({
  template: "You are a JavaScript expert and will answer the user’s coding questions as thoroughly as possible.\n{question}",
  inputVariables: ["question"],
});

console.log({model});

// Uses the instantiated OpenAI wrapper, model, and makes a call based on input from inquirer
const promptFunc = async (input) => {
  try {
    // Step 3: Format the prompt with the user's input
    const formattedPrompt = await prompt.format({
      question: input
    });

    // Step 4: Use the formatted prompt for the OpenAI call
    const res = await model.call(formattedPrompt);
    console.log(res);
  }
  catch (err) {
    console.error(err);
  }
};

// Initialization function that uses inquirer to prompt the user and returns a promise. It takes the user input and passes it through the call method
const init = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Ask a coding question:',
    },
  ]).then((inquirerResponse) => {
    promptFunc(inquirerResponse.name)
  });
};

// Calls the initialization function and starts the script
init();