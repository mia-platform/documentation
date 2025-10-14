import React from 'react';

// Green
export function ProdTag({label}) {
   return (
    <div>
      {label}
      <span
        style={{
          padding: '0 7px',
          color: '#259100',
          backgroundColor: '#DEF8D8',
          border: '1px solid #76CF60',
          borderRadius: '4px',
          marginLeft: '8px',
        }}
      >
        {'Current'}
      </span>
    </div>
  )
}

// White
export function StableTag({label}) {
   return (
    <div>
      {label}
      <span
        style={{
          padding: '0 7px',
          color: '#636363',
          backgroundColor: 'white',
          border: '1px solid #CDCDCD',
          borderRadius: '4px',
          marginLeft: '8px',
        }}
      >
        {'LTS'}
      </span>
    </div>
  )
}

// Cyan
export function NextTag({label}) {
   return (
    <div>
      {label}
      <span
        style={{
          color: '#08979c',
          background: '#e6fffb',
          border: '1px solid #87e8de',
          padding: '0 7px',
          borderRadius: '4px',
          marginLeft: '8px',
        }}
      >
        {'Next'}
      </span>
    </div>
  )
}

// Orange
export function CanaryTag({label}) {
   return (
    <div>
      {label}
      <span
        style={{     
          color: '#A44C00',
          background: '#FFF0B3',
          border: '1px solid #F68F1F',
          padding: '0 7px',
          borderRadius: '4px',
          marginLeft: '8px',
        }}
      >
        {'Canary'}
      </span>
    </div>
  )
}