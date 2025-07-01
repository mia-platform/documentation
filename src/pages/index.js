import React from "react";
import Layout from "@theme/Layout";
import HomePage from "../components/HomePage/HomePage";


function Home() {

    return (
        <Layout
            description="Mia-Platform provides the first end-to-end Digital Integration Hub on the market with a full DevOps Lifecycle Management: one unique Console to run Fast Data, Microservices and APIs."
            title={"Documentation - Mia-Platform"}
        >
            <main>
                <HomePage />
            </main>
        </Layout>
    );
}

Home.propTypes = {
}

export default Home;
