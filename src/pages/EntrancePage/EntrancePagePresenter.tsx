interface IEntrancePagePresenterProps {
  inputValue: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onEnter: () => void
}

const EntrancePagePresenter = ({
  inputValue,
  onChange,
  onEnter
}: IEntrancePagePresenterProps) => {
  return (
    <div>
      Enter your name
      <input value={inputValue} onChange={onChange} placeholder="Enter your name"/>
      <button 
        onClick={onEnter}
      >Enter</button>
    </div>
  )
}

export default EntrancePagePresenter