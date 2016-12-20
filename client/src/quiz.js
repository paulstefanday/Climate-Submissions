'use strict'

const html = require('choo/html')
const parts = require('./partTypes')
const getComp = state => state.competitions.filter(comp => comp.id === state.location.params.id)[0]
const addScroll = body => html`<div id="scrolling" class="w-75-ns w-100 h-100 right-fixed bg-white overflow-y-visible">${body}</div>`

const getCurrent = (state) => {
	// find comp and quiz
	let comp = getComp(state)

	// find current page where a part doesn't have a submission
	let latest // = { type: 'PARAGRAPH' } //comp.quiz.map()
	let latestIndex
	for (var i = 0; i < comp.parts.length; i++) {
		if(!comp.parts[i].submissions.length && !latest) {
			latest = comp.parts[i]
			latestIndex = i
		}
	}

	return {
		latest, latestIndex, comp
	}
}

const buttons = comp => (state, prev, send) => html`
<div class="absolute bottom-0 w-100">
	<button class="grow fl w-50 ba pv4 ph5 black-50 bg-transparent bn ttu f8"><i class="fa fa-chevron-left fl" aria-hidden="true"></i> Back</button>
	<button class="grow fr w-50 ba pv4 ph5 white bg-orange bn ttu f8">Next <i class="fa fa-chevron-right fr" aria-hidden="true"></i></button>
</div>`

const progress = comp => (state, prev, send) => html`
<div class="absolute top-0 w-100">
	<div class="fl w-100 bg-black-10" style="height:5px;">
		<div class="fl w-60 bg-orange relative" style="height:5px;">
		</div>
	</div>
</div>`

exports.html = (state, prev, send) => {

	let { latest, latestIndex, comp } = getCurrent(state)
	console.log(latest, latestIndex)
	return addScroll([
		parts[latest.form](latest)(state, prev, send),
		progress(comp)(state, prev, send),
		buttons(comp)(state, prev, send)
	])
}

exports.model = {
	namespace: "quiz",
	state: {},
	reducers: {},
	effects: {}
}
