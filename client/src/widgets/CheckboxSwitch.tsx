import ReactSwitch from 'react-switch'

interface Props {
  checked: boolean
  onChange: (isChecked: boolean) => void
  checkedLabel: string | React.ReactElement
  unCheckedLabel: string | React.ReactElement
}

const CheckboxSwitch: React.FC<Props> = props => {
  const {
    checked,
    onChange,
    checkedLabel,
    unCheckedLabel,
  } = props

  return (
    <label className="flex items-center space-x-2">
      <ReactSwitch
        checked={checked}
        onChange={onChange}
        onColor="#86d3ff"
        onHandleColor="#2693e6"
        offColor="#aaa"
        offHandleColor="#777"
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        height={15}
        width={35}
      />
      <div className="cursor-pointer">{checked ? checkedLabel : unCheckedLabel}</div>
    </label>
  )
}

export default CheckboxSwitch