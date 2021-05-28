import React, {useEffect} from "react";
import mermaid from "mermaid";
import PropTypes from "prop-types";

mermaid.initialize({
    startOnLoad: true
});

const Mermaid = ({chart}) => {
    useEffect(() => {
        mermaid.contentLoaded();
    }, []);
    return <div className="mermaid">{chart}</div>;
};

Mermaid.propTypes = {
    chart: PropTypes.string.isRequired
}

export default Mermaid;
