module.exports = probotPlugin
const handlePREvents = require('./lib/handlePREvents');

function probotPlugin (robot) {
  robot.on([
      'pull_request.opened',
      'pull_request.edited',
      'pull_request.synchronize'
    ], handlePREvents)

  robot.on('issues.opened', async context => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
    return context.github.issues.createComment(issueComment)
  })
}
