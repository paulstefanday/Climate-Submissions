'use strict'
const moment = require('moment')
const html = require('choo/html')
const quiz = require('./quiz').html
const getComp = state => state.competitions.filter(comp => comp.id === state.location.params.id)[0]
const addScroll = page => html`<div id="scrolling" class="w-75-ns w-100 h-100 right-fixed bg-white overflow-y-scroll">${page}</div>`

const introduction = (state, prev, send) => {
	let comp = getComp(state)
	let des = document.createElement('div')
  des.innerHTML = comp.description
	return addScroll(html`<div class="ph5 pv4">${des}</div>`)
}

const information = (state, prev, send) => {
	let comp = getComp(state)
	let des = document.createElement('div')
	des.innerHTML = comp.information
	return addScroll(html`<div class="ph5 pv4">${des}</div>`)
}

// TODO: for video page have the first one rendered and then make a playlist of the videos below
const videos = (state, prev, send) => {
	let comp = getComp(state)
	return addScroll(html`<div>
		${comp.videos.map(video => video !== "" ? html`
		<iframe
			width="100%"
			height="420"
			src="${video}?rel=0&amp;controls=0&amp;showinfo=0"
			frameborder="0"
			allowfullscreen></iframe>
	` : '')}
	</div>`)
}

const pages = { quiz, videos, information, introduction }

const button = ({ title, slug }) => (state, prev, send) => {
	// create link to tab
	let link = e => {
		// load page
		send('location:set', `/competition/${state.location.params.id}/${slug}`)
		// scroll up div
		let div = document.getElementById("scrolling")
		div.scrollTop = 0
	}
	// check if button should be highlighted or not
	let highlight = state.location.params.tab === slug ? 'bg-white-30' : 'bg-transparent'
	// set basic css for button
	let css = `grow fl ${highlight} w-100 bn ph4 pv3 f8 ttu tl white-50 border-box hover-white`
	// return button html with click event
	return html`<button onclick=${link} class=${css}>${title}</button>`
}

const sidebar = (state, prev, send) => {
	let comp = getComp(state)
	return html`
		<div class="w-25-ns w-100 h-100 left-fixed bg-center white-50 montserrat">
			<h3 class="fl w-60 white f4 fw9 b ph4 pv3 ">
				${comp.title}
				<span class="fl w-100 f7 fw3 tracked-mega ttu dib pv2  white-50 bg-transparent"></span>
			</h3>
			<div class="fl w-100 ">
				${button({ title: 'Introduction', slug: 'introduction' })(state, prev, send)}
				${button({ title: 'Quiz', slug: 'quiz' })(state, prev, send)}
				${button({ title: 'Information Toolkit', slug: 'information' })(state, prev, send)}
				${button({ title: 'Videos & More', slug: 'videos' })(state, prev, send)}
			</div>
			<a href="/v2/" class="no-underline bg-orange w-100 bn ph4 pv3 f8 ttu tl hover-white white-50 border-box absolute bottom-0 left-0 tc">
				<i class="fa fa-chevron-left fl" aria-hidden="true"></i> All competitions
			</a>
		</div>`
}

exports.html = (state, prev, send) => html`<div>
	${pages[state.location.params.tab](state, prev, send)}
	${sidebar(state, prev, send)}
</div>`
