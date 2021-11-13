const Pill: React.FC = props => {
  const {
    children
  } = props

  return (
    <div className="inline-block rounded-full text-white bg-blue-500 px-2 py-1 text-xs font-bold">
      {children}
    </div>
  )
}

export default Pill