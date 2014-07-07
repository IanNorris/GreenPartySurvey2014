var graphWidth = 800;
var graphBarHeight = 1000;
var graphHeight = 500;

var graphs = {};

String.prototype.format = function () {
	var args = arguments;
	return this.replace(/\{(\d+)\}/g, function (match, number) {
		return typeof args[number] !== 'undefined' 
			? args[number]
			: match;
	});
};

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function reduceSum(attr) {
	var functions =
	{
		add: function (p, v) {
			if (v.hasOwnProperty(attr)) {
				v[attr].forEach(
					function (val, index) {
						p[val] = (p[val] || 0) + 1;
					}
				);
			}

			return p;
		},
		remove: function (p, v) {
			if (v.hasOwnProperty(attr)) {
				v[attr].forEach(
					function (val, index) {
						p[val] = (p[val] || 0) - 1;
					}
				);
			}

			return p;
		},
		init: function () {
			return {};
		}
	};
	return functions;
}

function reduceSumGroup(dim, val) {
	var rs = reduceSum(val);
	var group = dim.groupAll().reduce(rs.add, rs.remove, rs.init).value();

	group.all = function () {
		var newObject = [];
		for (var key in this) {
			if (this.hasOwnProperty(key) && key != "all") {
				newObject.push({
					key: key,
					value: this[key]
				});
			}
		}
		return newObject;
	};

	return group;
}

function createCategoryGraph(divName, data, columnName) {
	var chart = dc.rowChart(divName);

	var dimension = data.dimension(function (d) { return d[columnName]; });
	var group = reduceSumGroup(dimension, columnName);

	chart
		.width(graphWidth)
		.height(graphBarHeight)
		.dimension(dimension)
		.group(group)
		.ordering(function (d) { return -d.value; })
		.filterHandler(
			function (dimension, filters) {
				dimension.filter(null);

				if (filters.length === 0) {
					dimension.filter(null);
				}
				else {
					dimension.filterFunction(function (d) {
						if (d) {
							for (var i = 0; i < d.length; i++) {
								if (filters.indexOf(d[i]) >= 0) {
									return true;
								}
							}
						}
						return false;
					});
				}

				return filters;
			}
		)
	;

	graphs[columnName] = chart;
}

function createPieChart(divName, data, columnName, slices) {
	var dimension = data.dimension(function (d) { return d[columnName]; });
	var group = dimension.group().reduceSum(function (d) { return 1; });

	group.all = function () {
		var newObject = [];
		for (var key in this) {
			if (this.hasOwnProperty(key) && key != "all") {
				newObject.push({
					key: key,
					value: this[key]
				});
			}
		}
		return newObject;
	};

	var chart = dc.pieChart(divName);
	graphs[columnName] = chart;
	chart
			.width(graphWidth)
			.height(graphHeight)
			.slicesCap(slices)
			.innerRadius(50)
			.legend(dc.legend())
			.dimension(dimension)
			.group(group)
	;
}

function createAgeChart(divName, data, columnName) {
	var dimension = data.dimension(function (d) { return d[columnName]; });
	var group = dimension.group().reduceSum(function (d) { return 1; });

	var chart = dc.barChart(divName);
	graphs[columnName] = chart;
	chart
			.width(graphWidth)
			.height(graphHeight)
			.x(d3.scale.linear().domain([14, 80]))
			.xAxisLabel("Age")
			.yAxisLabel("Count")
			.dimension(dimension)
			.group(group)
	;
}

function createChartHtml( data, json )
{
	var graphTargetDiv = '#' + json.divName + 'Graph';

	var graphTemplate = $("#graphTemplate").html();
	var formattedTemplate = graphTemplate.format( json.title, json.divName + 'Graph', json.columnName, json.description );
	$('#' + json.divName ).append( formattedTemplate );

	switch( json.type )
	{
		case 'pie':
			createPieChart( graphTargetDiv, data, json.columnName, json.slices );
			break;

		case 'multi':
			createCategoryGraph( graphTargetDiv, data, json.columnName );
			break;

		case 'age':
			createAgeChart( graphTargetDiv, data, json.columnName );
			break;

		default:
			console.log( "Unknown chart type " + json.type );
			break;
	}
}

function processGraphs( data, json )
{
	for( var index = 0; index < json.graphs.length; index++ )
	{
		createChartHtml( data, json.graphs[ index ] );
	}
}

var numberFormat = d3.format(".2f");

//Condense these fields into a single column
//Map of temporary short column names to new 'human readable' column names
var fieldsToCondenseAgainst =
[
	[ "Pro nuclear", "Disapprove of current nuclear policy" ],
	[ "Pro GM", "Disapprove of current stance on GM foods or GMO" ],
	[ "Practicality of financial policy", "Unfavourable views on economic policy" ],
	[ "Lack of experience", "Doubt that the party could effectively run a country" ],
	[ "Unscientific", "Respondent used the words anti-science, unscientific or similar" ],
	[ "Animal testing", "Disapprove of the current hardline stance on animal testing" ],
	[ "Holistic medicine", "Disapprove of policy on availability of holistic/homeopathy on the NHS" ],
	[ "FPTP", "Voting system prevents voting for primary choice, instead tactically voting to keep something worse out" ],
	[ "Brighton council", "Disapprove of track record of Brighton council" ],
	[ "Single issue party", "Green Party as still seen as being a single issue party" ],
	[ "Forced gender leadership", "Disapprove of policy of positive gender discrimination for party leadership" ],
	[ "Open door immigration", "Disapprove of open door immigration policy" ],
	[ "Trident", "Disapprove of current policy on Trident" ],
];

//Condense these fields into a single column
//Map of temporary short column names to new 'human readable' column names
var fieldsToCondenseFor =
[
	[ "Favour renationalisation", "Approve of renationalization (any of rail, postal, NHS)" ],
	[ "Tuition fees", "Approve of policy on tuition fees" ],
	[ "AGW", "Approve of policies to combat climate change" ],
	[ "Citizens income", "Approve of Citizens income/Universal basic income" ],
	[ "Prohibition", "Approve of policies to end prohibition of cannabis/hemp" ],
];

d3.csv("all.csv", function (csv)
{
	for( var index = 0; index < csv.length; index++ )
	{
		var row = csv[index];
		row["Important policies"] = row["Important policies"].split(", ");
		row["Against policies"] = row["Against policies"].split(", ");
		row["Approval policies"] = row["Approval policies"].split(", ");
		row["Key issues by name"] = row["Key issues by name"].split(", ");

		row["Unsolicited negative feedback"] = [];
		for( var fieldIndex = 0; fieldIndex < fieldsToCondenseAgainst.length; fieldIndex++ )
		{
			if (row.hasOwnProperty(fieldsToCondenseAgainst[fieldIndex][0]) && row[fieldsToCondenseAgainst[fieldIndex][0]] == "1")
			{
				row["Unsolicited negative feedback"].push(fieldsToCondenseAgainst[fieldIndex][1]);
			}
		}

		row["Unsolicited positive feedback"] = [];
		for( var fieldIndex = 0; fieldIndex < fieldsToCondenseFor.length; fieldIndex++ )
		{
			if (row.hasOwnProperty(fieldsToCondenseFor[fieldIndex][0]) && row[fieldsToCondenseFor[fieldIndex][0]] == "1")
			{
				row["Unsolicited positive feedback"].push(fieldsToCondenseFor[fieldIndex][1]);
			}
		}

		for( var key in row )
		{
			if( row.hasOwnProperty(key) && (row[key] == null || row[key] == "" || row[key] == "0" || (isNumber(row[key]) && +row[key] < "0")) )
			{
				delete row[key];
			}
		}
	}

	var data = crossfilter(csv);

	processGraphs( data, graph_data );

	dc.renderAll();

	$('.nav-pills li.menu a').on('click', function () {

		var scrollAnchor = $(this).attr('data-scroll');
		var scrollPoint = $('section[data-anchor="' + scrollAnchor + '"]').offset().top - 20;

		//$(".nav-pills li.active").removeClass("active");
		//$(this).parent('li').addClass('active');

		$('body,html').animate(
			{
				scrollTop: scrollPoint
			},
			500
		);

		return false;

	})


	$(window).scroll(function () {
		var windscroll = $(window).scrollTop();
		$('.wrapper section').each(function (i) {
			if ($(this).position().top <= windscroll - 20) {
				$('.nav-pills li.menu').removeClass('active');
				$('.nav-pills li.menu a[data-scroll=' + $(this).attr('data-anchor') + ']').parent('li').addClass('active');
			}
		});

	}).scroll();

	$('.loader').hide();
	$('.mainContent').show();
});