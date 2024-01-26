---
id: soup
title: SOUP Report
sidebar_label: SOUP
---

The *SOUP REPORT* [(Source of Unknown Provenance)](https://en.wikipedia.org/wiki/Software_of_unknown_pedigree) is a document that summarizes all the dependencies used in the SaMD product that has not been design for the intended used of the software.

## Report Structure

The document is an `.xsls` file containing two sheets:
1. The first one called `Sw items` lists all the microservices in the `master` branch of the console configuration. 
    The columns of the first sheet that are filled automatically are the following:
    - **Service Name**: the name of the microservice;
    - **Version**: the version of the microservice. This value can be found in the `Docker Image Name`. If it is interpolated in the public variables, it is set the value of the environment with `PROD` as identifier;
    - **Repository Link / Reference**: the link to the repository, if set through the console;
    - **Docker Image**: the path of the Docker Image;
    - **Functionality**: the description of the usage of the microservice. This can ve set via the `Description` field through the console;

    The following columns must be filled manually by the user:
    - **Manufacturer Name**: the name of the manufacturer of the microservice;
    - **Risk Level**: the risk level of the microservice, the value can be selected between:
      - **class A**
      - **class B**
      - **class C**
    - **Software Item**: the softare item related to the microservice;
    - **Usage**: the intended usage of the microservice;
    - **Verification Reasoning**: the verification reason of the microservice;
    - **Last Verified at**: the date of the last verification.


2. The second sheet is called `SOUP of custom sw items` and lists all the SOUP of the custom microservice created by the user.
    The columns of the second sheet are the following:
    
    - **Service Name**: the name of the  custom microservice that uses the SOUP;
    - **Software Unit Name**: name of the SOUP;
    - **Type**: the type of the SOUP (library or package for example);
    - **Version**: the version of the SOUP;
    - **PURL**: an [unique web identifier](https://en.wikipedia.org/wiki/Persistent_uniform_resource_locator) for the SOUP;
    - **Licenses**: a comma-separated list of the licenses of the SOUP.