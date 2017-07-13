import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import Loading from './Loading';

function SelectLanguage(props) {
	const languages = ['All', 'JavaScript', 'Ruby', 'CSharp', 'Java', 'CSS', 'Pyton'];

	return (
		<ul className="languages">
			{languages.map(lang => {
				return (
					<li key={lang}
						className={props.selectedLang == lang ? "selected" : ""}
						onClick={props.onSelect.bind(null, lang)}>
						{lang}
					</li>
				)
			})}
		</ul>
	)
}

function ReposGrid(props) {
	if(props.repos == null) {
		return <Loading />
	}
	return (
		<ul className="popular-list">
			{props.repos.map((repo, index) => {
				return (
					<li className="popular-item" key={repo.name}>
						<div className="popular-rank">#{index + 1}</div>
						<ul className="space-list-items">
							<li>
								<img src={repo.owner.avatar_url}
									className="avatar"
									alt={"Avatar for " + repo.owner.login} />
							</li>
							<li><a href={repo.html_url}>{repo.name}</a></li>
							<li>@{repo.owner.login}</li>
							<li>{repo.stargazers_count} stars</li>
						</ul>
					</li>
				)
			})}
		</ul>
	)
}

ReposGrid.propTypes = {
	repos: PropTypes.array.isRequired
}

SelectLanguage.propTypes = {
	selectedLang: PropTypes.string.isRequired,
	onSelect: PropTypes.func.isRequired
}

export default class Popular extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLang: 'All',
			repos: null
		};

		this.updateLanguage = this.updateLanguage.bind(this);
	}

	componentDidMount() {
		this.updateLanguage(this.state.selectedLang);
	}

	updateLanguage(lang) {
		this.setState( {selectedLang: lang, repos: null} );

		api.fetchPopularRepos(lang)
			.then(repos => {
				this.setState( {repos: repos} )
			});
	} 

	render() {
		return (
			<div>
				<SelectLanguage
					selectedLang={this.state.selectedLang}
					onSelect={this.updateLanguage}
				/>
				<ReposGrid repos={this.state.repos} />
			</div>
		)
	}
}