var graph_data = 
{
	graphs:
	[
		{
			type: 'pie',
			title: 'Would you want the Green Party to win a General Election?',
			columnName: 'Want Green to win GE',
			divName: 'wantGreenToWin',
			description: "This chart illustrates whether the respondents would like the Green Party to win a General Election. Respondents that chose 'Yes, if changes are made' are those who are currently voting No, but indicated they may potentially change their voting intentions if a few policy alterations were made. To see what these policies are, click the pie chart slice and it will only show results from these responses.",
			slices: 4,
		},

		{
			type: 'pie',
			title: 'Closest matching party',
			columnName: 'Closest matching party',
			divName: 'closestMatchingParty',
			description: "If the user completed the ISideWith survey and chose to share their result it will be displayed here. This gives a good approximation of leaning and is highly correlated against certain policy choices.",
			slices: 6,
		},

		{
			type: 'pie',
			title: 'How did you find this survey?',
			columnName: 'Origin',
			divName: 'referrer',
			description: "How did the responder find this survey? Reddit is by far the largest social network in the group as it has the largest immediate network for popular posts. I'm also glad to see a good turnout from the Green Party forms, meaning their voice of current members is well represented, although more people indicated they were Green Party members came from other sources.",
			slices: 5,
		},

		{
			type: 'age',
			title: 'How old are you?',
			columnName: 'Age',
			divName: 'age',
			description: "As expected there is a peak of those filling in the survey around the teen/young adult age. What was not expected is where the peak actually occurrs - 17. This is likely a bias due to the demographics of social media like Reddit and Twitter, but also a positive sign that the Green Party is attracting new voters - many of which will vote for the first time in 2015.",
		},

		{
			type: 'multi',
			title: 'What are the most important policies to you?',
			columnName: 'Important policies',
			divName: 'importantPolicies',
			description: "These are policies that the responder highlighted as of particular importance to them as a voter.",
		},

		{
			type: 'multi',
			title: 'What Green Party policies do you approve of the most?',
			columnName: 'Approval policies',
			divName: 'approvalPolicies',
			description: "These are policies that the responder picked out as things the party is doing particularly well and are of relevance to them personally. These are policies that will contribute to a Yes vote for the Green Party.",
		},

		{
			type: 'multi',
			title: 'What Green Party policies do you disapprove of the most?',
			columnName: 'Against policies',
			divName: 'againstPolicies',
			description: "These are policies that the responder highlighted as disagreeing or disapproving of. These are policies which will contribute to a No vote (a vote for another party).",
		},

		{
			type: 'multi',
			title: 'What other key issues are most important to you?',
			columnName: 'Key issues by name',
			divName: 'keyIssues',
			description: "These are the vote swinging single issues - the issues that will turn out voters.",
		},

		{
			type: 'multi',
			title: 'Are there any specific Green Party policies or positions that you support?',
			columnName: 'Unsolicited positive feedback',
			divName: 'unsolicitedPositive',
			description: "These are single issues that are well received by the responders and will contribute to a Yes vote for the Green Party.",
		},

		{
			type: 'multi',
			title: 'Are there any specific Green Party policies that would prevent you from voting for them or that make you uneasy?',
			columnName: 'Unsolicited negative feedback',
			divName: 'unsolicitedNegative',
			description: "This graph is arguably the most important of the lot - it shows what issues are preventing Green from receiving a larger percentage of the vote. Issues here are actively preventing votes and should be addressed immediately. This graph should be correlated against the 'Yes, if changes made' pie chart.",
		},
	]
}