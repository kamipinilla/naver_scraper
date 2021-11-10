import { twString } from '../types'

type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface Props {
    size?: HeadingSize
}

const H: React.FC<Props> = props => {
    const {
      children
    } = props
    
    const size = props.size ?? 'lg'

    function getHClass(): twString {
      let hClass = ''
      switch (size) {
        case 'sm':
          hClass += 'text-xl'
          break
        case 'md':
          hClass += 'text-3xl'
          break
        case 'lg':
          hClass += 'text-5xl'
          break
        case 'xl':
          hClass += 'text-7xl'
          break
        case '2xl':
          hClass += 'text-9xl'
          break
      }
      return hClass
    }

    return (
      <div className={getHClass()}>{children}</div>
    )
}

export default H