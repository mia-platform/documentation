---
id: what_is_fast_data
title: What is Fast Data
sidebar_label: What is Fast Data
---

In this page you will learn what is *Fast Data*, which **business problems it solves**, what are its main concepts, how it is **different from similar products**, and why you should keep all your **data organized and available** in near real time, **24/7**.

## Product overview

In this section we will briefly explain what is Fast Data, starting from your fragmented data, and its journey to become an aggregated source of truth that satisfies your business needs.

![Fast Data overview](./img/fastdata-overview.png)

The main goal of Fast Data is to aggregate business data from different sources (that we call **Systems of Record**) into a single MongoDB collection called **Single View**. This collection can be easily queried by your APIs. The aggregation is performed only when changes occur to the source data, making your read operations blazing fast as the data is already there.

The aggregation is done using another, valuable, intermediary collection called **Projection**. This collection is a **standardized** version of the original data, containing only the fields you are interested in, and *casting* them to a common format (e.g. it is common to have multiple date formats in your data sources, but with the correct configuration you can solve this issue and have one format shared among all Projections).

Moreover, Fast Data provides ready-to-use microservices and a user-friendly interface to set up the data flow in a **low-code** fashion. The low-code configuration helps you to get started in a very short amount of time.

## How Fast Data can impact your business

In this section we present the main scenarios in which Fast Data can significantly boost your company.

### Offloading of legacy systems

When you have legacy systems, trying to build services that need to use the fragmented data stored in non-scalable and already load-heavy systems can be quite problematic. While accessing data from different systems and aggregating them on demand, you will face many problems, such as:

* Slower response times;
* Heavy CPU/memory load, as more and more queries need to be served;
* Network congestion.

With Fast Data you can solve all of these problems, because the legacy systems will have a synced, transformed counterpart, the Projections, and aggregated versions in the Single Views. These collections are saved in MongoDB, without hindering the legacy systems, since you will no longer query them each time you need data. Instead, the legacy systems will only be concerned with sending events when they are updated.

### Centralization of data coming from different departments

If you are a medium or large company, you might have different departments each with their own applications and Systems of Record. Employees working in your back-office might need to access data that is saved in another system, but the application they are using is not allowed to access it.
Thanks to Fast Data, you can centralize all the relevant data and make them available to the correct services, without exposing confidential information nor tinkering with complex access control systems.

### Decreasing customer's wait time for aggregated data

When your data is fragmented in different legacy systems you need to query all of them, perform aggregation, and only then you are ready to serve the data. This can cause various issues, mostly high waiting time and costly CPU intensive processing.

Fast data solves the problem by providing you with Single Views that are aggregated whenever source data changes, which causes the aggregation to only happen once, saving precious CPU cycles and a lot of time, since the requests will not need to wait for the aggregation to happen every time they make a call.

### Making your company a Digital Platform

SQL data residing in legacy systems can be quite challenging to integrate in modern systems. Moving data to MongoDB with the help of Fast Data, you will unlock the potential to become a real Digital Platform. Specifically, you will be able to:

* Automatically expose the data through API, thanks to the CRUD service;
* Automatically generate API and data documentation, thanks to the API Portal;
* Scale horizontally with ease, thanks to MongoDB architecture.

With these new tools your company can grow faster than ever, become more connected, and fully become omnichannel.

## How is Fast Data different from similar products?

"ETL" systems (Extract, Transform, Load) are not big news, they have been around for decades and their principles are now a staple in the industry. So what makes Fast Data stand out from the crowd? It is easy to set up thanks to its **low code/ no code** functionality, fully customizable injecting actual javascript code as configuration, and part of an **ecosystem** that will grant you all the tools you need to make the most out of your standardized and aggregated data.

Moreover, Fast Data is used in production by many large companies, with millions of events handled every day, so you can be confident it is a reliable solution.

## GDPR

Fast Data services may log the primary keys of your projections, single views and keys of the Kafka Messages. Please, be sure that they are not sensible information in order to be in accordance with GDPR policies. Otherwise, you need to set topic retentions conformed to the rules and inform the Mia-Platform referent to set logs retention according to that.
