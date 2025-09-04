import CodeBlock from '@theme-original/CodeBlock'
import PropTypes from "prop-types"

import React, {useEffect, useState} from 'react'


export default function SourceCodeBlock({base, filePath}) {
  const [fileContent, setFileContent] = useState('')

  useEffect(() => {
    const calcFilePath = [base, filePath].join('')

    const abortController = new AbortController()

    fetch(calcFilePath, {signal: abortController.signal})
      .then(res => (res.ok ? res.text() : Promise.reject(new TypeError('Cannot retrieve source code'))))
      .then(text => setFileContent(text))
      .catch(err => {
        if (err instanceof DOMException && err.name === 'AbortError') { return }
      })

    return () => { abortController.abort() }
  }, [base, filePath])

  const fileExtension = filePath.slice((filePath.lastIndexOf('.') - 1 >>> 0) + 2)

  return (<CodeBlock language={fileExtension}>{fileContent}</CodeBlock>)
}

SourceCodeBlock.propTypes = {
  base: PropTypes.string,
  filePath: PropTypes.string.isRequired,
}