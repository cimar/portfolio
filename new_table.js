(function() {

	var tableData = null
	var tableCols = ["title", "date", "words", "tags", "genre", "outlet"]
	var chart = d3.select('.chart__table')
	var ascending = false

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
			outlet: row.outlet
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
			if (k === "words") {
				tableHead.append('th')
					.text("approx. # words")
			} else if (k === "tags") {
				tableHead.append('th').text("multimedia credit")
			} else if (k === "outlet") {
				tableHead.append('th').text("outlet(s)")
			} else {
				tableHead.append('th').text(k)
			}
		});


// make ascending and descending sort function, 
// have boolean so they can be swapped out for one another
// if an already sorted column is selected

		tableHead.selectAll("th")
			.data(tableCols).on("click", function(k) {
				console.log("onclick!")	
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



