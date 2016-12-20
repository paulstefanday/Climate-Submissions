'use strict'
const moment = require('moment')
const html = require('choo/html')

const stat = ({ stat, text }) => html`
<div class=" fl w-100  ph4 pv2 ma0 mr4 lh-0" >
	<span class="f3 f3-ns b ml0 fw9 tracked-tight fl" id="amount-jernos">${stat}</span>
	<span class="f8 ttu f5-ns ml0 w-100 fl tracked-mega">${text}</span>
</div>
`

const sidebar = (state, prev, send) => html`
<div class="w-25-ns w-100 h-100 left-fixed bg-center white-50 montserrat" onload=${() => send('getStats')}>
	<img src="/static/images/logo-white-sm.png" class="pa4" style="width:190px;" />
	${stat({ stat: state.stats.journalists, text: 'Journalists' })}
	${stat({ stat: state.stats.articles, text: 'Articles' })}
	${stat({ stat: state.stats.competitions, text: 'Live Competitions' })}
</div>`

const flags = (comp, state, send) => comp.countries ? html`
	<div class="fl w-100 white-40  absolute bottom-0 ttu montserrat f8 left-0 pv3 ph4">
		<i class="fa fa-map-marker" aria-hidden="true"></i> Countries Allowed
		<span class="fr">
			<span class="flag-icon flag-icon-gr"></span><span class="flag-icon flag-icon-fr"></span><span class="flag-icon flag-icon-gb"></span>
		</span>
	</div>
` : ''

const time = (comp, state, send) => {

	let time = moment(comp.finish).format('MMMM Do YYYY, h:mm:ss a')
	let converted = moment(time, 'MMMM Do YYYY, h:mm:ss a').fromNow()

	return html`
		<span class="db fw1 lh-0 measure white-40  f5 mb1 mt2 fl w-100">
			<span class="fl w-100"><i class="fa fa-clock-o" aria-hidden="true"></i> ${converted}</span>
			<span class="f8 montserrat ttu ">Finishes</span>
		</span>`
}

const joined = (comp, state, send) => html`
<span class="db fw1 lh-0 measure white-40 f5 mb1 mt2 fl w-100">
	<span class="fl w-100"><i class="fa fa-user" aria-hidden="true"></i> ${comp.users}</span>
	<span class="f8 montserrat ttu ">Joined</span>
</span>`

const prize = (comp, state, send) => html`
<span class="db lh-0 measure white-40 fw1 f5 mb1 mt2 fl w-100">
	<span class="fl w-100 lh-copy"><i class="fa fa-trophy" aria-hidden="true"></i> ${comp.prize}</span>
	<span class="f8 montserrat ttu ">Opportunity</span>
</span>`

const overlay = (comp, state, send) => {
	let finished = moment(comp.finish).isBefore(new Date())
	let open = e => send('location:set', '/competition/'+comp.id+'/introduction')
	return finished ?
				html`
				<div class="child g-o-orange absolute w-100 h-100 top-0 left-0 tc ">
					<div class="tc f4 fw9 white ttu tracked-mega" style="margin-top:200px;">Finished</div>
					<button class="bn bg-orange white pv2 ph4 mt2 ttu f8" onclick=${open}>View Archived</button>
				</div>` :
				html`
				<div class="child g-o-orange absolute w-100 h-100 top-0 left-0 tc " style="cursor:pointer">
					<i class="fa fa-chevron-right f1 white" style="margin-top:200px;" aria-hidden="true"></i>
				</div>`
}

const item = (comp, state, send) => {

	// open competition
	let open = e => send('location:set', '/competition/'+comp.id+'/introduction')

	// check if competition has finished
	let finished = moment(comp.finish).isBefore(new Date())

	// check that color is selected or get random
	if(!comp.image) comp.image = state.images[Math.floor(Math.random()*state.images.length)]

	// check that image has been uploaded or get random
	if(!comp.color) comp.color = state.colors[Math.floor(Math.random()*state.colors.length)]

	return html`
		<div onclick=${open} class="fl w-100 white-70 ${comp.color} hide-child grow relative">
		  <div class="fl w-100 w-70-ns content-block o-20" style="background-image:url('${comp.image}');">
		  </div>
		  <div class="fl w-100 w-30-ns pa4 measure-wide relative" style="height:440px;">
		    <b class="fl w-100 f4 mb1 fw9 white">${comp.title}</b>
		    ${time(comp, state, send)}
				${joined(comp, state, send)}
				${prize(comp, state, send)}
				${flags(comp, state, send)}
		  </div>
			${overlay(comp, state, send)}
		</div>
		`
}

exports.html = (state, prev, send) => html`
<div>
	<div class="fl w-75-ns w-100 right-fixed black-40 scroll">
		${state.competitions.map(comp => item(comp, state, send))}
	</div>
	${sidebar(state, prev, send)}
</div>
`
