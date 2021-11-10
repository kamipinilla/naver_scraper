import { twString } from '../types'

type ButtonType = 'light' | 'dark'

interface Props {
  onClick: () => void
  
  title?: string
  type?: ButtonType
  disabled?: boolean
}

const Button: React.FC<Props> = props => {
  const {
    onClick,
    disabled,
    title,

    children,
  } = props

  const type = props.type ?? 'light'

  function getTwClass(): twString {
    let buttonClass = 'flex space-x-1 items-center w-auto px-3 py-1 font-medium tracking-wide capitalize rounded-md focus:outline-none'
  
    switch (type) {
      case 'light':
        buttonClass += ' bg-white border border-black'
        break
      case 'dark':
        buttonClass += ' bg-black text-white border border-black'
        break
    }
  
    return buttonClass
  }

  return (
    <div>
      <button
        className={getTwClass()}
        onClick={onClick}
        disabled={disabled}
        title={title}>
        {children}
      </button>
    </div>
  )
}

export default Button