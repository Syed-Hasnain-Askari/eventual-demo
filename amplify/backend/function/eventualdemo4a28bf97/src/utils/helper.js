const getUserId = (request) => {
    try {
      const reqContext = request.apiGateway.event.requestContext;
      const authProvider = reqContext.identity.cognitoAuthenticationProvider;
      return authProvider ? authProvider.split(":CognitoSignIn:").pop() : "UNAUTH";
    } catch (error) {
      return "UNAUTH";
    }
  }
module.exports = {
    getUserId
}
  