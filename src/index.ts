import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';
dotenv.config();

// API HOST
const API_HOST = "https://api.zenhub.com/public/graphql";

// Get the ZenHub API token from env
const API_TOKEN = process.env.ZENHUB_APIKEY
// Get the ZenHub workspace id from env
const WORKSPACE_ID = process.env.ZENHUB_WORKSPACE_ID
const ZENHUB_REPOSITORY_GITHUB_ID = Number(process.env.ZENHUB_REPOSITORY_GITHUB_ID)

// Create a new GraphQL client
const client = new GraphQLClient(API_HOST, {
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

const query = `
query recentWorkspaceEpics($workspaceId: ID!) {
  workspace(id: $workspaceId) {
    epics(first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
      nodes {
        id
        issue {
          id
          repository {
            id
            name
          }
          number
          title
        }
      }
    }
  }
}
`

const getIssueDescriptionQuery = `
query getIssueInfo($issueNumber: Int!, $repositoryGhId: Int!) {
  issueByInfo(repositoryGhId: $repositoryGhId, issueNumber: $issueNumber) {
    id
    repository {
      id
      ghId
    }
    number
    title
    body
    state
    parentZenhubEpics(first: 5) {
      nodes {
        id
      }
    }
  }
}
`

const getEpicsQuery = `
query getEpicsForRepository($workspaceId: ID!, $repositoryGhIds: [Int!]) {
  workspace(id: $workspaceId) {
    id
    epics(repositoryGhIds: $repositoryGhIds, first: 50) {
      nodes {
        id
        issue {
          id
          title
          number
          htmlUrl
          repository {
            id
            name
          }
        }
      }
    }
  }
}
`


const addIssuesToEpicMutation =`
mutation addIssuesToEpic($issueId: ID!, $epicId: ID!) {
}
`

// Get issue number from 2nd argument
const issueNumber = Number(process.argv[2])

const variables = {
  workspaceId: WORKSPACE_ID,
  repositoryGhId: ZENHUB_REPOSITORY_GITHUB_ID,
  repositoryGhIds: [ZENHUB_REPOSITORY_GITHUB_ID],
  issueNumber
}

const result: any = await client.request(getEpicsQuery, variables)

console.log(result.workspace.epics.nodes)
