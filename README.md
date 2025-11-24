## Blog FIAP


#### Requisitos funcionais:

- GET /posts - Lista de Posts:
Este endpoint permitirá aos alunos visualizarem uma lista de
todos os posts disponíveis na página principal.

- GET /posts/:id - Leitura de Posts:
  Ao acessar este endpoint com um ID específico de post, os
alunos poderão ler o conteúdo completo desse post.

- POST /posts - Criação de Postagens:
▪ Permite que docentes criem novas postagens. Este
endpoint aceitará dados como título, conteúdo e autor no
corpo da requisição.

- PUT /posts/:id - Edição de Postagens:
▪ Usado para editar uma postagem existente. Professores
deverão fornecer o ID do post que desejam editar e os novos
dados no corpo da requisição.

- GET /posts - Listagem de Todas as Postagens:
▪ Este endpoint permitirá que professores vejam todas as
postagens criadas, facilitando a gestão do conteúdo.

- DELETE /posts/:id - Exclusão de Postagens:
▪ Permite que docentes excluam uma postagem específica,
usando o ID do post como parâmetro.

- GET /posts/search - Busca de Posts:
▪ Este endpoint permitirá a busca de posts por palavraschave. Os usuários poderão passar uma query string com o
termo de busca e o sistema retornará uma lista de posts que
contêm esse termo no título ou conteúdo.