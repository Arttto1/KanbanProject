import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {
  CREATE_SUBTASK, GET_SUBTASKS_BY_TASK
} from '../graphql/subtask-queries-mutations';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  constructor(private apollo: Apollo) {}

  // Método para criar uma nova subtask
  createSubtask(name: string, task: string) {
    return this.apollo
      .mutate<any>({
        mutation: CREATE_SUBTASK,
        variables: { name, task },
        update: (cache, { data }) => {
          // Lê os dados do cache, que é a lista atual de subtasks
          const existingSubtasks: any = cache.readQuery({
            query: GET_SUBTASKS_BY_TASK,
            variables: { task },
          });

          // Verifica se já existem subtasks no cache
          if (existingSubtasks && existingSubtasks.getSubtasksByTask) {
            // Obtém a nova subtask criada
            const newSubtask = data?.createSubtask; // Certifique-se de que está acessando a subtask corretamente

            // Atualiza o cache com a nova subtask
            cache.writeQuery({
              query: GET_SUBTASKS_BY_TASK,
              variables: { task },
              data: {
                getSubtasksByTask: [...existingSubtasks.getSubtasksByTask, newSubtask], // Adiciona a nova subtask
              },
            });

            console.log('Colunas atualizadas no cache:', newSubtask);
          } else {
            console.log('Nenhuma subtask encontrada no cache');
          }
        },
      })
      .pipe(
        map((result) => {
          return result.data; // Retorna os dados da mutação, se necessário
        })
      );
  }

   getSubtasksByTask(task: string) {
      return this.apollo
        .watchQuery({
          query: GET_SUBTASKS_BY_TASK,
          variables: { task },
        })
        .valueChanges.pipe(
          map((result: any) => {
            // Aqui usamos map para garantir que estamos apenas extraindo e formatando os dados corretamente
            return result.data.getSubtasksByTask.map((subtask: any) => ({
              id: subtask.id,
              name: subtask.name,
              task: subtask.task,
              isCompleted: subtask.isCompleted
            }))})
        );
    }
}
