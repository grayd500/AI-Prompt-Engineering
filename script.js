// Dependencies
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
const inquirer = require('inquirer');
require('dotenv').config();

// Initialize OpenAI model with API key and configuration
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.5, // Adjusted temperature for creativity
  model: 'gpt-3.5-turbo'
});

// Instantiate a StructuredOutputParser for output formatting
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  code: "Code explanation",
  explanation: "Improvement suggestions and generated documentation",
});

// Define format instructions for the parser
const formatInstructions = parser.getFormatInstructions();

// PromptTemplate for Salesforce LWC queries
const prompt = new PromptTemplate({
  template: "Provide detailed information, instructions, or best practices for the following Salesforce Lightning Web Component question:\n{userQuery}\n",
  inputVariables: ["userQuery"]
});

// Log the model configuration to console for verification
console.log({model});

// Function to process code snippet input from the user
const promptFunc = async (userQuery) => {
  try {
    // Format the prompt with the user's question about Salesforce LWC
    const formattedPrompt = await prompt.format({
      userQuery: userQuery
    });

    // Call the OpenAI model with the formatted prompt
    const res = await model.call(formattedPrompt);

    // Directly log the AI response
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
  }
};

// Initialization function to collect user input for code snippet
const init = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'userQuery',
      message: 'What do you want to know about Salesforce Lightning Web Components?',
    }
  ]).then((inquirerResponse) => {
    // Process the provided query through our updated function
    promptFunc(inquirerResponse.userQuery);
  });
};

// Start the application
init();