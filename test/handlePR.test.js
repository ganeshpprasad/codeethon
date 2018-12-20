const handlePREvents = require('../lib/handlePREvents')
const nock = require('nock')
const github = require('@octokit/rest')()

// prevent all network activity to ensure mocks are used
nock.disableNetConnect()

describe('handlePullRequestChange', () => {
  test('it is a function', () => {
    expect(typeof handlePREvents).toBe('function')
  })

  test('sets `failure` status if PR description does not have "Things to be tested:"', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `
      Things to be tested:
      JIRA url: adkasd
      Collaborators: sumit,
      Deployment type: engine
    `
    const expectedBody = {
      state: 'faiure',
      target_url: 'https://github.com/anuragmaher',
      description: 'Pull Request Description Test',
      context: 'Pull Request Description Test'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sumit/codeethon/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sumit/codeethon/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePREvents(context)
    expect(mock.isDone()).toBe(false)
  })
  
  test('sets `failure` status if PR description does not have "Jira URl:"', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `
      Things to be tested:
      JIRA ur
      Collaborators: sumit,
      Deployment type: engine
    `
    const expectedBody = {
      state: 'faiure',
      target_url: 'https://github.com/anuragmaher',
      description: 'Pull Request Description Test',
      context: 'Pull Request Description Test'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sumit/codeethon/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sumit/codeethon/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePREvents(context)
    expect(mock.isDone()).toBe(false)
  })

  test('sets `failure` status if PR description does not have "Collaborators:"', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `
      Things to be tested:
      JIRA url: adkasd
      Deployment type: engine
    `
    const expectedBody = {
      state: 'faiure',
      target_url: 'https://github.com/anuragmaher',
      description: 'Pull Request Description Test',
      context: 'Pull Request Description Test'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sumit/codeethon/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sumit/codeethon/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePREvents(context)
    expect(mock.isDone()).toBe(false)
  })

  test('sets `failure` status if PR description does not have "Deployment type:"', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `
      Things to be tested:
      JIRA ur
      Collaborators: sumit
    `
    const expectedBody = {
      state: 'faiure',
      target_url: 'https://github.com/anuragmaher',
      description: 'Pull Request Description Test',
      context: 'Pull Request Description Test'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sumit/codeethon/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sumit/codeethon/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePREvents(context)
    expect(mock.isDone()).toBe(false)
  })

  test('sets `success` status if PR has title without WIP', async () => {
    const context = buildContext()
    context.payload.pull_request.body = `
      Things to be tested: engine
      JIRA url: adkasd
      Collaborators: sumit,
      Deployment type: engine
    `
    const expectedBody = {
      state: 'faiure',
      target_url: 'https://github.com/anuragmaher',
      description: 'Pull Request Description Test',
      context: 'Pull Request Description Test'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sumit/codeethon/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sumit/codeethon/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePREvents(context)
    expect(mock.isDone()).toBe(true)
  })
})

function buildContext (overrides) {
  const defaults = {
    log: () => { /* no-op */ },

    // an instantiated GitHub client like the one probot provides
    github: github,

    // context.repo() is a probot convenience function
    repo: (obj = {}) => {
      return Object.assign({ owner: 'sumit', repo: 'codeethon' }, obj)
    },

    payload: {
      pull_request: {
        number: 123,
        title: 'Ideas are bulletproof',
        head: {
          sha: 'abcdefdsada'
        }
      }
    }
  }

  return Object.assign({}, defaults, overrides)
}

function unsemanticCommits () {
  return [
    { commit: { message: 'fix something' } },
    { commit: { message: 'fix something else' } }
  ]
}
