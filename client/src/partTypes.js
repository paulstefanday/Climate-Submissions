const html = require('choo/html')

exports.PARAGRAPH = (data) => (state, prev, send) => ([
	html`<div class="fl w-100 ph5 pt5 pb5 bg-white">
				<h1 class="f1 fw9 black-70 ma0 mt4 tracked-tight">This is a basic question?</h2>
				<p class="black-30 fw3 f6">Here is an extra descrition for the question to clarify anything extra so it's easier to understand.</p>
			</div>`,
	html`<textarea class="pv4 ph5 f6 fl w-100 bg-transparent bt-1 bb-0 bl-0 br-0 b--black-10" placeholder="Enter your answer here..." style="height:250px;"></textarea>`
])


exports.ARTICLE = (data) => (state, prev, send) => ([
	html`<div class="fl w-100 ph5 pt5 pb5 bg-white">
				<h1 class="f1 fw9 black-70 ma0 mt4 tracked-tight">Submit an article url</h2>
				<p class="black-30 fw3 f6">Upload your article to dropbox or google drive and share the link here with us.</p>
			</div>`,
	html`<input class="pv4 ph5 f6 fl w-100 bg-transparent bt-1 bb-0 bl-0 br-0 b--black-10" placeholder="Enter your url here..." style="height:250px;" />`
])
