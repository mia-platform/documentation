---
id: applepay
title: Apple Pay
sidebar_label: Applepay
---
Note that at the moment Apple Pay payments are only supported with the Gestpay (Axerve) provider.

## Gestpay

### Making a payment

The service is expecting a JSON representation of a [ApplePayPKPaymentToken](https://git.tools.mia-platform.eu/platform/plugins/payment-gateway-manager/-/blob/master/src/main/kotlin/eu/mia_platform/payment_gateways_manager/gestpay/model/PaymentSubmitApplePayRequest.kt#L44) described as below:

```typescript
{
  paymentData: {
    data: string,
    signature: string,
    version: string,
    header: {
      ephemeralPublicKey: string,
      publicKeyHash: string,
      transactionId: string,
    }
  },
  transactionIdentifier: string
  paymentMethod: {
    network: string,
    type: string,
    displayName: string
  }
}
```

#### How to retrieve the payment token

Few steps are required in order to obtain a payment dictionary compliant to the structure expected above.
After making a `PKPaymentRequest` using Apple's PassKit framework, you can retrieve the `PKPayment` object from the `PKPaymentAuthorizationViewController` didAuthorizePayment completion callback.

1. Create a Foundation object from the given `payment.token.paymentData` data:

    ```objective-c
    NSData *paymentData = payment.token.paymentData;
    NSError *serializationError = nil;

    id dict = [NSJSONSerialization JSONObjectWithData:paymentData options:NSJSONReadingFragmentsAllowed error:&serializationError];
    // error handling with serializationError
    ```

2. Create the payment method dictionary:

    ```objective-c
    // ...
    NSDictionary *paymentMethodDictionary = @{
        @"network": payment.token.paymentMethod.network,
        @"type": [NSNumber numberWithUnsignedLongLong:payment.token.paymentMethod.type],
        @"displayName":payment.token.paymentMethod.displayName
    };
    // ...
    ```

3. Create the payment information dictionary and convert it as JSON data:

    ```objective-c
    // ...
    NSError *dataWritingError = nil;
    NSDictionary *paymentDictionary = @{
        @"paymentData":dict,
        @"transactionIdentifier":payment.token.transactionIdentifier,
        @"paymentMethod":paymentMethodDictionary
    };

    NSData *data = [NSJSONSerialization dataWithJSONObject:paymentDictionary options:NSJSONWritingFragmentsAllowed error:&dataWritingError];
    // error handling with dataWritingError
    ```

4. Initialize a NSString with the data to be used as token to be provided to the `/pay` endpoint:

    ```objective-c
    // ...
    NSString *paymentDataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    // ...
    ```
