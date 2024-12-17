import { gql } from "apollo-angular";

export const CREATE_TASK = gql`
mutation createTask($name: String!, $description: String!, $status: String!) {
  createTask(createTaskInput: { name: $name, description: $description, status: $status }) {
    id
    name
    description
    status
  }
}
`;

export const GET_ALL_TASKS = gql`
  query getAllTasks {
    getAllTasks {
      id
      name
      description
      status
    }
  }
`;

export const GET_TASKS_BY_STATUS = gql`
query getTasksByStatus($status: String!) {
  getTasksByStatus(status: $status) {
    id
    name
    description
    status
  }
}
`;

export const DELETE_TASK = gql`
  mutation deleteTask($id: String!) {
    deleteTask(id: $id)
  }
`;