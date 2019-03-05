#Audit Process

##Audit Introduction
Mia-Platform reserves the right to verify the use of the license in production of the Customers.  
Audit is necessary when the license is hosted on Cloud or On Premise by the client.

More precisely, Mia-Platform verifies that:

* the number of Production Nodes purchased by the Customer is equal to or greater than the number of Nodes of Production used;

* the number of Pre-production nodes purchased by the customer is equal to or greater than the number of nodes of Pre-production used;

* the number of Users - Operator, Manager and Developer - purchased is equal to or greater than the number of Active Users;

* the number of Instances of CMS API and API Console is equal to or less than the number of Instances purchased.

Mia-Platform activates the Audit procedure with a written notice to the Client of forty-five (45) days.

##Requirements

Mia-Platform would need the following information for the audit:

* List of the name of the clusters that host Mia-Platform;

* History of the cluster configurations, starting from the last audit/installation. For this the Clients can choose between the two following options:
       1. Enabling AWS Config Service on the Kubernetes clusters: https://aws.amazon.com/config/;
       2. Providing Mia-platform with a logging service where we can log periodically the sizing of the license.

## Process

We will perform the audit providing to the Client a script that will create a plain text file + hmac-sha256 report that the Client has to sent back to us.

The script needs a temporary full access to the Kubernetes API of the clusters.
