import React from "react";
import Layout from "@theme/Layout";
import HomePageComponent from "../components/HomePage/HomePageComponent";
import configuration from "../config/homepage.json";


function Home() {

    return (
        <Layout
            description="Mia-Platform provides the first end-to-end Digital Integration Hub on the market with a full DevOps Lifecycle Management: one unique Console to run Fast Data, Microservices and APIs."
            title={"Documentation - Mia-Platform"}
        >
            <main>
                <HomePageComponent configuration={configuration} />
            </main>
        </Layout>
    );
}

Home.propTypes = {
}

export default Home;
