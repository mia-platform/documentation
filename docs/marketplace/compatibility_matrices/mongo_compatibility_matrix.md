---
id: mongo_compatibility_matrix
title: MongoDB Compatibility Matrix
sidebar_label: MongoDB Compatibility Matrix
---


The table shows a compatibility matrix for MongoDB versions support of Marketplace items.

:::caution

This is an indicative list. For up to date information about the latest versions of the services, please visit their documentation.

:::


<table>
    <tr>
        <th>MongoDB Server Version</th>
        <th></th>
        <th>5.0</th>
        <th>6.0</th>
        <th>7.0</th>
    </tr>
    <tr>
        <td rowspan="4"><a href="../../runtime_suite/crud-service/overview_and_usage">CRUD Service</a></td>        
        <td>v7.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
    </tr>
    <tr>
        <td>v6.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
    </tr>
    <tr>
        <td>v5.x.x</td>
        <td>✅</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
        <td>v3.x.x</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
        <td rowspan="4"><a href="../../fast_data/realtime_updater">Real-Time Updater</a></td>
        <td>v7.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
    </tr>
    <tr>
        <td>v6.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
    </tr>
    <tr>
        <td>v5.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
    </tr>
    <tr>
        <td>v4.x.x</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
        <td rowspan="1"><a href="../../fast_data/projection_storer">Projection Storer</a></td>
        <td>v1.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
    </tr>
    <tr>
        <td rowspan="1"><a href="../../fast_data/single_view_trigger_generator">Single View Trigger Generator</a></td>
        <td>v3.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
    </tr>
    <tr>
        <td rowspan="5"><a href="../../runtime_suite/single-view-creator/configuration">Single View Creator</a></td>
        <td>v6.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
    </tr>
    <tr>
        <td>v5.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
    </tr>
    <tr>
        <td>v4.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
    </tr>
    <tr>
        <td>v3.5.1</td>
        <td>✅</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
        <td>v3.0.0</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
        <td rowspan="2"><a href="../../runtime_suite/auth0-client/overview">Auth0 Client</a></td>
        <td>v3.0.0</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
    </tr>
    <tr>
        <td>v2.3.1</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
        <td rowspan="2"><a href="../../runtime_suite/mongodb-reader/configuration">MongoDB Reader</a></td>
        <td>v2.1.0</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
    </tr>
    <tr>
    <td>v2.0.2</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
    <td rowspan="2"><a href="../../console/tutorials/configure-marketplace-components/flow-manager">Flow Manager</a></td>
        <td>v2.6.0</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
    </tr>
    <tr>
        <td>v2.2.0</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
    <td rowspan="2"><a href="../../runtime_suite/mongo2kafka/configuration">Mongo2Kafka</a></td>
        <td>v1.1.2</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
    </tr>
    <tr>
        <td>v1.1.1</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
        <td rowspan="2"><a href="../../runtime_suite/files-service/configuration">Files Service</a></td>
        <td>>= v2.9.0</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
    </tr>
    <tr>
        <td>>= v2.3.x</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
    <tr>
        <td><a href="../../runtime_suite/push-notification-manager/configuration">Notification Manager</a></td>
        <td>v2.x.x</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
    </tr>
</table>