import React from 'react'
import PropTypes from 'prop-types'

export const CenteredContent = ({
  width,
  height,
  children,
}) => {
  const contentStyle = {
    display: 'flex'
  }
  if (width) {
    contentStyle.width = width
  }
  if (height) {
    contentStyle.height = height
  }
  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={contentStyle}>

        {children}

      </div>
    </div>
  )
}

CenteredContent.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  height: PropTypes.string,
  width: PropTypes.string
}