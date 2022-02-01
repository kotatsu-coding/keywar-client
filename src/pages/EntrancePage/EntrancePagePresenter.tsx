interface IEntrancePagePresenterProps {
  inputValue: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onEnter: () => void,
  onEnterAsAGuest: () => void
}

const EntrancePagePresenter = ({
  inputValue,
  onChange,
  onEnter,
  onEnterAsAGuest
}: IEntrancePagePresenterProps) => {
  return (
    <div>
      Enter your name
      <input value={inputValue} onChange={onChange} placeholder="Enter your name"/>
      <button 
        onClick={onEnter}
      >Enter</button>
      <button
        onClick={onEnterAsAGuest}
      >Enter as a guest</button>
    </div>
  )
}

export default EntrancePagePresenter