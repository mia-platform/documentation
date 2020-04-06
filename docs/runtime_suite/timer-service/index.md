# Timer Service

The _Timer Service_ allows to schedule timers that, when expired, do an action, based on the passed configurations.

It can be used, for example, if a client needs to send a _Kafka_ message, or to do a _REST_ call, with a specific payload, after 10 minutes from a specific date.

The _Timer Service_ is easy to use and easy to configure:

- [_Timer Service_ configuration](./configuration.md)

- [_Timer Service_ usage](./usage.md)

For more about the techical specifications of the service, contributions and so on, have a look to the [repository](https://git.tools.mia-platform.eu/clients/helvetia/timer-service).

## Contributions

To contribute you can check the dedicate [`contributions` file](https://git.tools.mia-platform.eu/clients/helvetia/timer-service/-/blob/master/CONTRIBUTION.md) on the repository.

## Service Limitations

- **horizontal scaling**: right now is not possible to horizontal scale the service because the service polls from the dedicated database and all instances would receive same pending timers
- **abort forgetfulness**: the abort should be done just in case of _pending_ timers but, right now, this check is missing (there is a dedicated section into the contributions file)
- **REST methods limit**: the _rest_ output allows just `post`, `put` or `patch` as REST Verbs, because it sends a payload; it would be nice to allow all the verbs and, in case of verbs without the body, ignore the payload (there is a dedicated section into the contributions file)
