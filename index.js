module.exports = probotPlugin

const handlePullRequestChange = require('./lib/handle-pull-request-change')
const handlePROpened = require('./lib/handlePROpened');
function probotPlugin (robot) {
  robot.on(
    'pull_request.opened',
    handlePROpened
  )

  robot.on(
    'push', async context => {
      // Code was pushed to the repo, what should we do with it?
      robot.log(context)
      console.log(context)
  })

  robot.on('issues.opened', async context => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
    return context.github.issues.createComment(issueComment)
  })
}
