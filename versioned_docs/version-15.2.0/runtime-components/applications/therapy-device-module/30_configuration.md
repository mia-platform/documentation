---
id: configuration
title: Therapy and Device Module configuration
sidebar_label: Configuration
---



## Configuration steps

### Environment variables

Review the following public variables, which contain references to the K8S namespaces:

- **USER_MANAGER_MODULE_NAMESPACE**
- **USER_MANAGER_SERVICE_URL**: `http://user-manager-service.{{USER_MANAGER_MODULE_NAMESPACE}}.svc.cluster.local`
- **NOTIFICATION_MANAGER_URL**: `http://notification-manager.{{NOTIFICATION_MODULE_NAMESPACE}}.svc.cluster.local`

### Proxies

Define one `cross-project` proxy to the `USER_MANAGER_MODULE_NAMESPACE` with this specifications:

- host: `user-manager-service`;
- port: `80`.

### Endpoints

No additional endpoints are required.

## Client-side field level encryption

Client-Side Field Level Encryption (CSFLE) is a feature that enables you to encrypt data in your application before you send it over the network to MongoDB. With CSFLE enabled, no MongoDB product has access to your data in an unencrypted form.

The CRUD Service can use CSFLE as explained in the microservice [documentation][mia-crud-service-csfle].

## Patient Monitoring Portal

The Therapy and Device Module capabilities can be tested with the exposed HTTP REST API interface or using the *Doctors and Patients Monitoring Portal*, which is a GUI client currently under development. Please contact the Mia-Care team to have access to this portal. 

## Device Manager

The Device manager let you to integrate with medical devices and wearables.
You can use device manager to receive the data from your devices and show them on the portal.

### Medisanté

We can extract the data from Medisanté devices. For now you have to add the device name and id manually to the portal and then you have to assign the device to a patient.
You can do all of these steps through the patient portal. 
When you receive new data from specific device you will see the data on the dashboard of the assigned patient.

### Healthkit

To extract the data from healthkit users need to install and logged in to the mia-health-data application. The first time that the users sign in, the application asks for the permissions.  Users are required to give all the permissions to the app otherwise it will not work correctly.
After the permissions are granted by the app a request will be sent and a new device will be created by the id of the wearable and will be assigned to the logged in patient.
The app will ask you to read the following data from HealthKit:

ActiveEnergyBurned, ActivitySummary, AllergyRecord, AppleExerciseTime, AppleStandTime, BasalEnergyBurned, BiologicalSex, BloodType, BloodAlcoholContent, BloodGlucose, BloodPressureDiastolic, BloodPressureSystolic, BodyFatPercentage, BodyMass, BodyMassIndex, BodyTemperature, DateOfBirth, Cholesterol, CoverageRecord, EnergyConsumed, EnvironmentalAudioExposure, FatMonounsaturated, FatPolyunsaturated, FatSaturated, FatTotal, HeadphoneAudioExposure, ImmunizationRecord, LabResultRecord, MedicationRecord, OxygenSaturation, PantothenicAcid, Phosphorus, ProcedureRecord, Riboflavin, Sugar, VitalSignRecord, Water, DistanceCycling, DistanceSwimming, DistanceWalkingRunning, Electrocardiogram, FlightsClimbed, HeartbeatSeries, HeartRate, RestingHeartRate, HeartRateVariability, Height, LeanBodyMass, MindfulSession, NikeFuel, PeakFlow, RespiratoryRate, SleepAnalysis, StepCount, Steps, Vo2Max, WaistCircumference, WalkingHeartRateAverage, Weight, Workout, WorkoutRoute.


### Data Acquisition Flow

When new data received by the device manager it will be normalized based on the defined normalization rules and then if there was a matched monitoring plan for the new record it will be detected by a monitoring plan. To read more about the monitoring plans and detection please refer to the [Therapy and Monitoring Manager][mia-therapy-and-monitoring-manager] documentation.
For the data that are coming from medical devices or wearables, we already defined a default normalization rules, but there is also the possibility to define new rules and create normalized data based on your need, to do so please refer to the [Device Manager][mia-device-manager] documentation.


## Microservices documentation

For additional details about the **Therapy and Monitoring Module** and **Device MAnager** configuration, please refer to the documentation of its microservices building blocks:

- [Therapy and Monitoring Manager][mia-therapy-and-monitoring-manager]
- [Device Manager][mia-device-manager]


[mia-crud-service-csfle]: /runtime-components/plugins/crud-service/30_encryption_configuration.md
[mia-therapy-and-monitoring-manager]: /runtime-components/plugins/therapy-and-monitoring-manager/10_overview.md
[mia-device-manager]: /runtime-components/plugins/device-manager/10_overview.md
[notification-manager]: /runtime-components/plugins/notification-manager-service/10_overview.md
[tmm-notifications]: /runtime-components/plugins/therapy-and-monitoring-manager/10_overview.md#notifications
