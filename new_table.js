(function() {

	var tableData = null
	var tableCols = ["title", "date", "words", "tags", "genre", "outlet"]
	var chart = d3.select('.chart__table')
	var ascending = false
	var up_html = "<span class='not-sort'>⬆️</span>"
	var down_html = "<span class='not-sort'>⬇</span>"

	function link(title,url){
		link ='<a href="'+url+'">'+title+'</a>'
		return link
	}

	function cleanRow(row) {
		var target = {
			title: row.title,
			url: row.url,
			date_str: row.date,
			date: d3.timeParse('%m/%d/%y')(row.date),
			words: +row.words,
			tags: row.tags,
			genre: row.genre,
			outlet: row.outlet,
			highlight: row.highlight
		}
		return target
	}

	function loadData(cb) {
		d3.tsv('updated_clips.tsv', cleanRow, function(err, data) { 
			tableData = data
			cb() 
		});
	}

	function setupElements(){
		var table = chart.select('.tables')
				.append('table')
		var tableHead = table.append('thead')
		var tableBody = table.append('tbody')

		var tableRow = tableBody.selectAll('tr')
				.data(tableData)
				.enter()
				.append('tr')

		tableCols.map(function(k) {
			k_html = ""
			if (k === "words") {
				k_html = "approx. # words" + up_html + down_html
			} else if (k === "tags") {
				k_html = "multimedia credit" + up_html + down_html
			} else if (k === "outlet") {
				k_html = "outlet(s)" + up_html + down_html
			} else {
				k_html = k + up_html + down_html
			}
			tableHead.append('th').html(k_html)
		});


		tableHead.selectAll("th")
			.data(tableCols).on("click", function(k) {	
				tableRow.sort(function(a,b){
					if (ascending === false) {
						return (b[k] < a[k])
					} else {
						return (b[k] > a[k])
					}
				})
				ascending = !ascending
			})

		tableCols.map(function(k) {
			tableRow.each(function(d) {
			       	var self = d3.select(this);
				if(k === "title"){
					self.append("td")
						.append("a")
						.attr("href", d.url)
						.text(d.title)
				} else {
					if (k === "date") {
						self.append("td")
							.text(d3.timeFormat('%m/%d/%y')(d[k]))
					} else if (k ==="outlet") {
						self.append("td").html(d[k])
					} else {
						self.append("td")
							.text(d[k])
					}
				}
				if (d["highlight"] === "Y") {
					console.log("highlighting ",d)
					self.attr("class", "highlight")
				}
			});
		})

	}
	
	function init() {
		loadData(function() {
			setupElements()
		})
	}
	init()
})()



