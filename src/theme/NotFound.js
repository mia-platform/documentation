/* eslint-disable react/jsx-no-literals */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Layout from '@theme/Layout';
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

function getMailLink() {
  const location = ExecutionEnvironment.canUseDOM ? window.location.href : null
  const emailSubject=`Documentation Broken link report`
  const emailBody=`The link ${location} seems to be broken`

  return `mailto:info@mia-platform.eu?subject=${emailSubject}&body=${emailBody}`
}

function NotFound() {
  return (
    <Layout title="Page Not Found">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1 className="hero__title">Oops! Page Not Found</h1>
            <p>Sorry, we could not find what you were looking for.</p>
            <p>You can:</p>
            <ul>
              <li>Go back to <a href="/">home page</a></li>
              <li><a href={getMailLink()} target="blank">Let us know</a></li>
              <li><a href="/overview/mia_platform_overview">Find out how to get started with Mia-Platform</a></li>
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default NotFound;
