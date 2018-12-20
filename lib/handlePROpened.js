async function handlePROpened(context) {
    const { head, body } = context.payload.pull_request
    debugger
    const status = {
        sha: head.sha,
        state: 'pending',
        target_url: 'https://github.com/ganeshpprasad/codeethon',
        description: 'Pull Request Description Test',
        context: 'Pull Request Description Test'
    }
    await context.github.repos.createStatus(context.repo(status))
}

module.exports = handlePROpened