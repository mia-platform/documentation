import React from 'react'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import CodeBlock from '@theme/CodeBlock'
import JSONSchemaViewer from "@theme/JSONSchemaViewer"
import PropTypes from "prop-types";

export default function SchemaViewer({schema, example, disableExampleTab}) {
    return (
        <Tabs groupId='json-schema-viewer' queryString>
            <TabItem label="Schema Viewer" value="viewer">
                <JSONSchemaViewer schema={schema} />
            </TabItem>
            <TabItem label="Raw JSON Schema" value="raw">
                <CodeBlock language="json">
                    {JSON.stringify(schema, null, 2)}
                </CodeBlock>
            </TabItem>
            {disableExampleTab === true ? null : renderExample(example, schema?.examples)}
        </Tabs>
    )
}

function renderExample(providedExample, schemaExamples) {
    if (providedExample !== null && providedExample !== undefined) {
       return (
           <TabItem label="Example" value="example">
               <CodeBlock language="json">
                 {JSON.stringify(providedExample, null, 2)}
               </CodeBlock>
           </TabItem>
       )   
    }
    
    if (schemaExamples?.length > 0) {
        return (
            <TabItem label="Example" value="example">
                <CodeBlock language="json">
                  {JSON.stringify(schemaExamples?.[0], null, 2)}
                </CodeBlock>
            </TabItem>
        )
    }

    return (
        <TabItem label="Example" value="example">
            <CodeBlock language="json">{"example not provided"}</CodeBlock>
        </TabItem>
    )
}

SchemaViewer.propTypes = {
    disableExampleTab: PropTypes.boolean,
    example: PropTypes.object,
    schema: PropTypes.object,
}
