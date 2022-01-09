import React from 'react'
import { components } from 'react-select'
import { default as ReactSelect } from 'react-select'

const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{' '}
        <label>{props.label}</label>
      </components.Option>
    </div>
  )
}

interface BridgeSelectorParams{
    options: any
    onChange: any
    value: any
}

export default function BridgeSelector({options, onChange, value}: BridgeSelectorParams) {
    return (
        <ReactSelect
          options={options}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{
            Option
          }}
          onChange={onChange}
          value={value}
        />
    )
}