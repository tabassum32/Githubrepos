import {Component} from 'react'

import Loader from 'react-loader-spinner'

import RepositoryItem from '../RepositoryItem'

import LanguageFilterItem from '../LanguageFilterItem'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Write your code here

class GithubPopularRepos extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    repositoriesDataList: [],
    activeLanguageFilterId: languageFiltersData[0].id,
  }

  componentDidMount() {
    this.getRepositoryData()
  }

  getRepositoryData = async () => {
    const {activeLanguageFilterId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilterId}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.popular_repos.map(each => ({
        id: each.id,
        issuesCount: each.issues_count,
        name: each.name,
        forksCount: each.forks_count,
        starsCount: each.stars_count,
        imageUrl: each.avatar_url,
      }))
      this.setState({
        repositoriesDataList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-heading">Something went wrong</h1>
    </div>
  )

  renderSuccessView = () => {
    const {repositoriesDataList} = this.state

    return (
      <ul className="repository-list-con">
        {repositoriesDataList.map(each => (
          <RepositoryItem key={each.id} repositoryDetails={each} />
        ))}
      </ul>
    )

    renderRepositories = () => {
      const {apiStatus} = this.state

      switch (apiStatus) {
        case apiStatusConstants.success:
          return this.renderSuccessView()
        case apiStatusConstants.failure:
          return this.renderFailureView()
        case apiStatusConstants.inProgress:
          return this.renderLoaderView()
        default:
          return null
      }
    }

    setActiveLanguageFilterId = newFilterId => {
      this.setState(
        {activeLanguageFilterId: newFilterId},
        this.getRepositoryData,
      )
    }

    renderLanguageFilterList = () => {
      const {activeLanguageFilterId} = this.state

      return (
        <ul className="filter-list">
          {languageFiltersData.map(each => (
            <languageFilterItem
              key={each.id}
              isActive={each.id === activeLanguageFilterId}
              languageFilterDetails={each}
              setActiveLanguageFilterId={this.setActiveLanguageFilterId}
            />
          ))}
        </ul>
      )
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1 className="heading">Popular</h1>
          {this.renderLanguageFilterList()}
          {this.renderRepositories()}
        </div>
      </div>
    )
  }
}
export default GithubPopularRepos
