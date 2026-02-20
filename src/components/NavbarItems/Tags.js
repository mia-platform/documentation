import React from 'react';

// Green
export function ProdTag({label}) {
   return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {label}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content',
          padding: '0 7px',
          color: '#259100',
          backgroundColor: '#DEF8D8',
          borderRadius: '12px',
          marginLeft: '8px',
        }}
      >
        {'Current'}
      </span>
    </div>
  )
}

// Cyan
export function NextTag({label}) {
   return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {label}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content',
          color: '#08979c',
          background: '#e6fffb',
          padding: '0 7px',
          borderRadius: '12px',
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
    <div style={{display: 'flex', alignItems: 'center'}}>
      {label}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content',
          color: '#A44C00',
          background: '#FFF0B3',
          padding: '0 7px',
          borderRadius: '12px',
          marginLeft: '8px',
        }}
      >
        {'Canary'}
      </span>
    </div>
  )
}