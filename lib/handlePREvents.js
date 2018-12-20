module.exports = handlePREvents

async function handlePREvents(context) {
    const { head, body } = context.payload.pull_request
    console.log(body);

    const state = testObjective1(body) ? 'success' : 'failure';
    
    const status = {
        sha: head.sha,
        state,
        target_url: 'https://github.com/ganeshpprasad',
        description: 'Pull Request Description Test',
        context: 'Pull Request Description Test'
    }
    const res = await context.github.repos.createStatus(context.repo(status))
    return res;
}

//  --coverage --coverageReporters=text-lcov | coveralls && standard",

function testObjective1(desc) {
    const required = [
        /(Things to be tested:) \w+\n?/i,
        /(JIRA URL:) \w+\n?/i,
        /(Collaborators:) \w+\n?/i,
        /(Deployment Type:) (AppEngine|Engine|AppExtension|Extension)\n?/i
    ]
    return required.reduce((prev, reg) => {
        return reg.test(desc) && prev
    }, true)
    
}