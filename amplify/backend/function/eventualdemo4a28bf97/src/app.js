const AWS = require('aws-sdk')
const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} = require=("@aws-sdk/lib-dynamodb");
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
const { v4: uuidv4 } = require('uuid')
AWS.config.update({ region: process.env.TABLE_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();
// Create a DynamoDB client
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
let tableName = "eventualdemo";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});
/************************************
* HTTP Get method to fetch users *
*************************************/
app.get("/api", function (request, response) {
  let params = {
    TableName: tableName,
    limit: 100
  }
  dynamodb.scan(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Items) })
    }
  });
});
/************************************
* HTTP Get method to fetch users by ID *
*************************************/
app.get("/api/:id", function (request, response) {
  let params = {
    TableName: tableName,
    Key: {
      id: request.params.id
    }
  }
  dynamodb.get(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Item) })
    }
  });
});
/************************************
* HTTP Post method to Add user *
************************************/

app.post("/api", function (request, response) {
  const timestamp = new Date().toISOString();
  const id = uuidv4();
  // Add "account" and "date" fields to the request body
  const requestBodyWithAdditionalFields = {
    ...request.body,
    id: id,
    complete: false,
    account: "account_value", // Replace with the actual account value you want to set
    date: timestamp // You can set the date to the current timestamp
  };

  let params = {
    TableName: tableName,
    Item: requestBodyWithAdditionalFields // Use the modified request body
  };

  dynamodb.put(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(params.Item) })
    }
  });
});


/************************************
 * HTTP Delete method to delete Record *
 ************************************/

app.delete(`/api/:${request.params.id}`, async function (request, response) {
  await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id:request.params.id,
      },
    })
  );
});

/************************************
 * HTTP put method to update Record *
 ************************************/
app.put('/api/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id,"id---->")
  const updatedItem = req.body;
  try {
    // Construct the update expression
    const updateExpression = [];
    const expressionAttributeValues = {};

    if (updatedItem.name !== undefined) {
      updateExpression.push("SET #name = :name");
      expressionAttributeValues[":name"] = updatedItem.name;
    }

    if (updatedItem.account !== undefined) {
      updateExpression.push("SET #account = :account");
      expressionAttributeValues[":account"] = updatedItem.account;
    }

    // Add more attributes as needed

    updateExpression.push("SET #updatedAt = :updatedAt");
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    // Define the update command
    const updateCommand = new UpdateItemCommand({
      TableName: "userDetails", // Replace with your table name
      Key: { id: { S: id } }, // Assuming 'id' is a string, adjust the type as needed
      UpdateExpression: updateExpression.join(", "),
      ExpressionAttributeNames: {
        "#name": "name",
        "#account": "account",
        "#updatedAt": "updatedAt",
        // Add more attribute names here
      },
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    // Execute the update command
    const response = await client.send(updateCommand);
    const updatedAttributes = response.Attributes;

    // Handle the updatedAttributes here if needed

    console.log(`Item updated: ${JSON.stringify(updatedAttributes)}`);

    // You can perform additional actions here after the update

  } catch (error) {
    console.error(`Unable to update item with id ${id}: ${error}`);
  }
})