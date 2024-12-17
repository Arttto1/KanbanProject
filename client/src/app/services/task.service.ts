import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {
  CREATE_TASK,
  GET_ALL_TASKS,
  GET_TASKS_BY_STATUS,
  DELETE_TASK,
} from '../graphql/task-queries-mutations';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private apollo: Apollo) {}

  // Método para criar uma nova task
  createTask(name: string, description: string, status: string) {
    return this.apollo
      .mutate<any>({
        mutation: CREATE_TASK,
        variables: { name, description, status },
        update: (cache, { data }) => {
          // Lê os dados do cache, que é a lista atual de tasks
          const existingTasks: any = cache.readQuery({ query: GET_TASKS_BY_STATUS, 
            variables: { status }
          });

          console.log(existingTasks)

          // Verifica se já existem tasks no cache
          if (existingTasks && existingTasks.getTasksByStatus) {
            // Obtém a nova task criada
            const newTask = data?.createTask; // Certifique-se de que está acessando a task corretamente

            // Atualiza o cache com a nova task
            cache.writeQuery({
              query: GET_TASKS_BY_STATUS,
              variables: { status },
              data: {
                getTasksByStatus: [...existingTasks.getTasksByStatus, newTask], // Adiciona a nova task
              },
            });

            console.log('Colunas atualizadas no cache:', newTask);
          } else {
            console.log('Nenhuma task encontrada no cache');
          }
        },
      })
      .pipe(
        map((result) => {
          return result.data; // Retorna os dados da mutação, se necessário
        })
      );
  }

  getAllTasks() {
    return this.apollo
      .watchQuery({
        query: GET_ALL_TASKS,
      })
      .valueChanges.pipe(
        map((result: any) => {
          // Aqui usamos map para garantir que estamos apenas extraindo e formatando os dados corretamente
          return result.data.getAllTasks.map((task: any) => ({
            id: task.id,
            name: task.name,
            description: task.description,
            status: task.status,
          }));
        })
      );
  }

  // Função para obter as tarefas com base no status
  getTaskByStatus(status: string) {
    return this.apollo
      .watchQuery({
        query: GET_TASKS_BY_STATUS,
        variables: { status },
      })
      .valueChanges.pipe(
        map((result: any) => {
          // Aqui usamos map para garantir que estamos apenas extraindo e formatando os dados corretamente
          return result.data.getTasksByStatus.map((task: any) => ({
            id: task.id,
            name: task.name,
            description: task.description,
            status: task.status
          }))})
      );
  }

  deleteTask(id: string) {
    return this.apollo.mutate<any>({
      mutation: DELETE_TASK,
      variables: { id },
      update: (cache, { data }) => {
        // Lê os dados do cache, que é a lista atual de colunas
        const existingTasks: any = cache.readQuery({ query: GET_ALL_TASKS });

        if (existingTasks && existingTasks.getAllTasks) {
          // Obtém a nova coluna criada
          const newTask = data?.createTask; // Certifique-se de que está acessando a coluna corretamente

          // Verifica se as colunas existem no cache
          if (existingTasks && existingTasks.getAllTasks) {
            const updatedTasks = existingTasks.getAllTasks.filter(
              (task: { id: string }) => task.id !== id
            );

            // Escreve a nova lista de colunas no cache
            cache.writeQuery({
              query: GET_ALL_TASKS,
              data: { getAllTasks: updatedTasks },
            });
          }
          console.log('Colunas atualizadas no cache:', newTask);
        } else {
          console.log('Nenhuma Task encontrada no cache');
        }
      },
    });
  }
}
