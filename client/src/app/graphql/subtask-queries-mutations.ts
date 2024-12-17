import { gql } from "apollo-angular";

export const CREATE_SUBTASK = gql`
mutation createSubtask($name: String!, $task: String!) {
  createSubtask(createSubtaskInput: { name: $name, task: $task }) {
    id
    name
    task
    isCompleted
  }
}
`;

export const GET_SUBTASKS_BY_TASK = gql`
query getSubtasksByTask($task: String!) {
  getSubtasksByTask(task: $task) {
    id
    name
    task
    isCompleted
  }
}
`;