// Write your code here
const LanguageFilterItem = props => {
  const {isActive, languageFilterDetails, setActiveLanguageFilterId} = props
  const {id, language} = languageFilterDetails
  const buttonClassName = isActive
    ? 'language-btn active-language-btn'
    : 'language-btn'

  const onClickLanguage = () => {
    setActiveLanguageFilterId(id)
  }

  return (
    <li>
      <button
        className={buttonClassName}
        onClick={onClickLanguage}
        type="button"
      >
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
