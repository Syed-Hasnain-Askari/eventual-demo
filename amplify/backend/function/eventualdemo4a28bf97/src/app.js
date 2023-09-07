const AWS = require('aws-sdk')
const userId = require('./utils/helper')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
const { v4: uuidv4 } = require('uuid')
AWS.config.update({ region: process.env.TABLE_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();
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

app.delete("/api/:id", function (request, response) {
  let params = {
    TableName: tableName,
    Key: {
      id: request.params.id
    }
  }
  dynamodb.delete(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result) })
    }
  });
});

/************************************
 * HTTP put method to update Record *
 ************************************/

app.patch("/api", function (request, response) {
  const timestamp = new Date().toISOString();
  const params = {
    TableName: tableName,
    Key: {
      id: request.body.id,
    },
    ExpressionAttributeNames: { '#text': 'text' },
    ExpressionAttributeValues: {},
    ReturnValues: 'UPDATED_NEW',
  };
  params.UpdateExpression = 'SET ';
  if (request.body.text) {
    params.ExpressionAttributeValues[':text'] = request.body.text;
    params.UpdateExpression += '#text = :text, ';
  }
  if (request.body.complete) {
    params.ExpressionAttributeValues[':complete'] = request.body.complete;
    params.UpdateExpression += 'complete = :complete, ';
  }
  if (request.body.text || request.body.complete) {
    params.ExpressionAttributeValues[':updatedAt'] = timestamp;
    params.UpdateExpression += 'updatedAt = :updatedAt';
  }
  dynamodb.update(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Attributes) })
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, async function(req, res) {
  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  try {
    const data = await ddbDocClient.send(new GetCommand(getItemParams));
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.json(data) ;
    }
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});
