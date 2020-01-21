
A microservice that allows you to create a distributed transaction between 2 user applications that are not integrated with each other.

The first application saves the exchange data in the service receives a token.

The second application uses the token to retrieve the data; at the end it generates the result generating a second token.

![CQRS Schema](img/token.png)
