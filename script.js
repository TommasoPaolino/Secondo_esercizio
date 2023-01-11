const svgEl = document.getElementById('chart')
const width = svgEl.getAttribute('width')
const height = svgEl.getAttribute('height')
const padding = 100
const svg = d3.select('#chart')
const color1 = '#87CEFA'
const color2 = '#FF8400'
const textColor = '#194d30'
const ticks = 10

const vpadding = 45
const hpadding = 80

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
	var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	}
}

const describeArc = (x, y, radius, startAngle, endAngle) => {

	var start = polarToCartesian(x, y, radius, endAngle)
	var end = polarToCartesian(x, y, radius, startAngle)

	var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

	var d = [
	    "M", start.x, start.y, 
	    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ")

	return d + `L ${x} ${y} Z`       
}



const data = d3.csvParse(dataset, d => {
	return {
		companyType : d.companyType,
		nCompanies : +d.nCompanies,
		percControlled : +d.percControlled,
		evasion : +d.evasion
	}
})

const xScale=d3.scaleLinear()
	.domain([0,data.length])
	.range([hpadding,width-hpadding])


const yScale=d3.scaleLinear()
	.domain([0,d3.max(data, d => d.evasion)])
	.range([height-vpadding,vpadding])



const yAxis=d3.axisLeft(yScale)
	.ticks(ticks)
	.tickSize(-(width-(hpadding*2)))


const yTicks = svg
	.append('g')
	.attr('transform', `translate(${hpadding}, 0)`)
	.call(yAxis)



//<line x1="0" y1="80" x2="100" y2="20" stroke="black" />
data.forEach(function(d, i) { 
	svg
	.append("line")
	.attr("x1", ""+hpadding+"")
	.attr("x2", ""+(width-hpadding)+"")
	.attr("y1", ""+yScale(d.evasion)+"") 
	.attr("y2", ""+yScale(d.evasion)+"")
	.attr("stroke", "#D3D3D3")
	.attr('color', textColor)

	svg
	.append("g")
	.attr('transform',`translate(${hpadding-67}, ${yScale(d.evasion)})`)
	.append("text")
	.attr("font-size", "10px")
	.style("font-family", "sans-serif")
	.style("color", "rgb(25, 77, 48)")
	.text(numberWithCommas(d.evasion))
	




	})

const Radius = (width /  (data.length + 20))  

svg
	.selectAll('.tick line')
	.style('stroke', '#D3D3D3')


svg
	.selectAll('.tick text')
	.style('color', textColor)


svg
	.selectAll('path.domain')
	.style('stroke-width', 0)
	
const aziende = svg
	.selectAll('g.azienda')
	.data(data)
	.enter()
	.append('g')
		.attr('class', 'stringa')
		.attr('transform',(d,i) => `translate(${xScale(i)}, ${yScale(d.evasion)})`)
	

const cerchi = aziende
 	.append('circle')
	 	.attr('fill',color1)
 		.attr('r',Radius)
		.attr('cx', hpadding)
		.attr('cy', 0)


const archi = aziende
 	.append('path')
	 	.attr('fill', color2)
		.attr('d', d => describeArc((hpadding), 0, Radius, 0, (d.percControlled * 360)))
		

const testo = svg
        .selectAll('g.testo')
		.data(data)
		.enter()
		.append('g')
			.attr('class', 'testo')
			.attr('transform',(d,i) => `translate(${hpadding+ xScale(i)}, ${yScale(height) +20})`)
			
testo.append("text").text(function(d){ return d.companyType}).style("text-anchor", "middle")


const testo_perc = svg
        .selectAll('g.perc')
		.data(data)
		.enter()
		.append('g')
			.attr('class', 'perc')
			.attr('transform',(d,i) => `translate(${hpadding+ xScale(i)}, ${d3.max(data, d => d.evasion) == d.evasion ? yScale(d.evasion) +  Radius +15 : yScale(d.evasion) -  Radius -7 })`);
			
testo_perc.append("text").text(function(d) {return bigDecimal.round(""+d.percControlled * 100 +"" , 2) + '%'}).style("text-anchor", "middle")

svg.append("g")
	.attr("transform", "translate(" + `${(width- 75 - hpadding*2)}` + "," + 30 + ")")
	.append("text")
	.attr("font-size", "15px").text("Legenda:")

svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width - hpadding*2-12) + "," + ((hpadding/2) + 11) + ")")
	.attr("width", "10")
	.attr("height", "10")
	.attr("fill", '#FF8400')

svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width - hpadding*2-12) + "," + ((hpadding/2) - 4) + ")")

	.attr("width", "10")
	.attr("height", "10")
	.attr("fill", '#87CEFA')

svg.append("g")
	.attr("transform", "translate(" + (width - hpadding*2) + "," + ((hpadding/2) +5 ) + ")")
	.append("text")
	.attr("font-size", "12px").text("Controllate")

svg.append("g")
	.attr("transform", "translate(" + (width - hpadding*2)  + "," + ((hpadding/2)+20 ) + ")")
	.append("text")
	.attr("font-size", "12px").text("Non controllate")


console.log(data)



