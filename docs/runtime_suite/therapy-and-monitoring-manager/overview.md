---
id: overview
title: Therapy and Monitoring Manager
sidebar_label: Overview
---
The therapy and monitoring manager (TMM) is a service that enables health care professionals to manage patients **therapies** and **monitor** patients health conditions, adherence and compliance to therapy. The service allows the definition of **thresholds** and notification mechanism to alert the involved entities, typically physician and patient, of events which occur during the therapy and monitoring period.

:::note
Sending notifications based on thresholds is a feature currently under development and planned to be released in the future.
:::

In addition to therapies and monitorings, there are also **observations**. Observations are entered by the patient to whom the therapy and monitoring are directed, and represent the steps taken by the patient to meet the plan.

The adherence and compliance metrics will be calculated based on the observations entered by the patient. These metrics will trigger the sending of notifications, as set by the physician who created the therapy or monitoring.

:::note
Sending notifications based on adherence and compliance metrics is a feature currently under development and planned to be released in the future.
:::

For such observations, you can define an archetype, called **prototype**, to act as a validator. For example, you could define a prototype to validate observations related to body temperature, verifying that the observation value is a number between 34 and 42 °C.

In the documentation, when you encounter any of the terms listed below, you should assume they have the described meaning, unless stated otherwise.

| Term          | Meaning      |
|---------------|--------------|
| *Adherence*   | A therapy or monitoring metric indicating if the patient is performing the tasks according to the timeframe defined by the physician. |
| *Compliance*  | A therapy or monitoring metric indicating if the patient is performing the correct tasks as prescribed by the physician. |
| *Doctor*      | See *Physician*. |
| *Monitoring*  | A physician prescription to monitor health conditions (blood pressure, body temperature, vital signs, etc.). |               |
| *Observation* | A patient feedback on a therapy (e.g. I took the drug at 9) or monitoring (e.g. the minimum and maximum blood pressure measured). |
| *Patient*     | A person undergoing therapy or monitoring. |
| *Physician*   | A doctor prescribing therapies or monitorings to a patient. |
| *Plan*        | A therapy or monitoring plan prescribed by a physician. |
| *Prototype*   | An archetype for an observation, should provide generic (related to all patients) specifications to validate an observation value, for example to ensure a medical device is reporting correctly. |
| *Therapy*     | A physician prescription for some therapies (taking drugs, etc.). |
| *Threshold*   | Monitoring thresholds specific for a patient therapy or monitoring, for example his/her expected blood pressure. |

## Adherence and compliance

The Therapy and Monitoring Manager models the concepts of adherence and compliance. These two metrics define how well the patient is adhering to the guidelines given by the physician for a monitoring or therapy.

Let us define the two metrics. Formally:

* A patient is considered **adherent** to a therapy or monitoring if that patient performs the assigned tasks within the timeframe defined by the physician, net of tolerances that may be defined.
* A patient is considered **compliant** to a therapy or monitoring if that patient performs the tasks exactly as described in the description of the plan by the physician (e.g. takes the correct drug in the correct amount).

:::note
Please note that the **compliance** with a therapy or monitoring is not influenced by the timeframe.
:::

In order to better clarify the difference between the two metrics, let's make a couple of examples:

1. Let us suppose that a physician prescribes the following therapy:

    ```txt
    The patient must takes the pill X with dosage Y twice a day.
    ```

    where the adherence tolerance frequency is 1, minimum adherence percentage is 90% and minimum compliance percentage is 80%.  

    The patient is considered:
    * **adherent** to therapy if, for at least 90% of the days, that patient complies with the frequency of observations, thus twice a day, plus or minus the given tolerance, which in this example means taking the pill at least once and at most three times a day;
    * **compliant** to therapy if, for at least 80% of the days, that patient complied exactly what the physician defined in the notes, so take exactly the pill X with dosage Y.

2. Let us suppose that a physician prescribes the following therapy:

    ```txt
    The patient must takes the pill X at 10am and 2pm.
    ```

    where the adherence tolerance time (in hours) is 1, minimum adherence percentage is 90% and minium compliance percentage is 80%.

    The patient is considered:
    * **adherent** to therapy if, for at least 90% of the days, the patient complies with the timeframes of observations, thus at 10am and 2pm, also considering tolerance, which in this example is 1 hour, so it is allowed to take pill between 9am and 11am and between 1pm and 3pm;
    * **compliant** to therapy if, for at least 80% of the days, the patient does exactly what the physician defined in the notes, so take exactly the pill X with dosage Y.

The **adherence** and **compliance** metrics are not necessary linked. Being **compliant** does not mean being **adherent**. This is true for the reverse as well.

Indeed, a patient can be **adherent but not compliant**. Looking at the above example, this is the case if the patient takes drug twice per day but not the correct drug.

A patient can also be **compliant but not adherent**. Considering the above example, this is the case if the patient takes the correct drug but not at the right hours, for instance if he takes it at 5pm and 9pm.

## Therapies

The service allows you to create, update and delete therapies for patients, such as administering a medication for a specific time frame, by defining:

* the name of the plan;
* the notes and directives of the doctor drafting the therapy;
* the reference to the prototype containing the validation rules for the observations entered by the patient;
* the start date of the therapy;
* the end date of the therapy (this value is not required if the therapy has an indefinite time frame);
* the frequency or the timeframes of therapy (this value is not required if the therapy does not include a periodic performance of the actions described by the physician);
* the reference to the physician who created the therapy;
* the reference to the patient to whom the therapy is addressed;
* the tolerance on the frequency or time of intake for which a particular observation entered by the patient is still considered adherent to the therapy;
* the minimum percentage value for which a patient is considered adherent to therapy with respect to reported observations;
* the minimum percentage value for which a patient is considered compliant to therapy with respect to reported observations.

## Monitorings

The service allows you to create, update and delete monitorings for patients, such as monitoring blood pressure for a specific period of time, by defining:

* the name of the plan;
* the notes and directives of the physician writing the monitoring;
* the reference to the prototype containing the validation rules for the observations entered by the patient;
* the start date of the monitoring;
* the end date of the monitoring (this value is not required if the monitoring has an indefinite duration);
* the frequency of monitoring operations (this value is not required if the monitoring does not include periodic performance of the actions described by the physician);
* the reference of the physician who created the monitoring;
* the reference of the patient to whom the monitoring is addressed;
* the tolerance on the frequency or time of intake for which a particular observation entered by the patient is still considered adherent or compliant to the monitoring;
* the minimum percentage value for which a patient is considered adherent to monitoring with respect to reported observations;
* the minimum percentage value for which a patient is considered compliant to monitoring with respect to reported observations.

## Observations

The service allows tracking actions performed by the patient concerning a specific therapy or monitoring, such as reporting body temperature or taking certain medication at specific time. The observation is defined by:

* the reference to the therapy or monitoring to which the observation is linked;
* the value of the observation (this value can be atomic, such as a number, or a complex object, such as an entity composed by different values: an example of complex object can be the blood pressure, that is composed by a minimum and a maximum value);
* the compliance of the observation with respect to what prescribed by the physician;
* the date of the observation; 

  :::note Please note that the date the observation was entered may be different from the date the observation was conducted. :::

* the reference to the referring physician for the therapy or monitoring;
* the reference to the patient to whom the therapy or monitoring relates.

## Prototypes

The prototypes define the specifications of acceptable values related to certain observations. These prototypes are nothing but JSON Schema that are applied to the input observations to validate the related values. These prototypes are defined at the microservice configuration level.

The prototypes should be used to validate the patient input and ensure it is reliable, to prevent human errors when submitting values read from a medical device.

:::tip

If your medical device can report measurements between a well-defined range, you should use the range maximum and minimum to validate the observation submitted by the user.

:::

:::danger

Prototypes should not be used to monitor the expected vital signs of patients subject to monitorings, but thresholds should be used instead.

:::

For each prototype you need to define:

- the unique identifier;
- the type (can be `measurement` or `therapy`);
- the name;
- the schema.

Let's see a couple of examples:

- a prototype to ensure the body temperature reported by the patient is between 34 and 42: in this example we expect the observation value to be an object with a field `bodyTemperature`;

```json
{
  "identifier": "bodyTemperature",
  "type": "measurement",
  "name": "Body Temperature Prototype",
  "schema": {
    "type": "object",
    "properties": {
      "bodyTemperature": {
        "type": "number",
        "minimum": 34,
        "maximum": 42
      }
    },
    "required": [
      "bodyTemperature"
    ]
  }
}
```

- a prototype to ensure the reported blood pressure has a minimum between 60 and 150 and a maximum between 80 and 250: in this example we expect the observation value to be an object with two fields, `minimumBloodPressure` and `maximumBloodPressure`;

```json
{
  "identifier": "bloodPressure",
  "type": "measurement",
  "name": "Blood Pressure Prototype",
  "schema": {
    "type": "object",
    "properties": {
      "minimumBloodPressure": {
        "type": "integer",
        "minimum": 60,
        "maximum": 150
      },
      "maximumBloodPressure": {
        "type": "integer",
        "minimum": 80,
        "maximum": 250
      }
    },
    "required": [
      "minimumBloodPressure",
      "maximumBloodPressure"
    ]
  }
}
```
