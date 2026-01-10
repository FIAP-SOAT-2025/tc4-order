# language: pt
Funcionalidade: Entidade Order
  Como um sistema de gerenciamento de pedidos
  Eu quero validar o comportamento da entidade Order
  Para garantir a integridade e consistência dos pedidos

  Contexto:
    Dado que o sistema está operacional

  Cenário: Criar pedido com id fornecido
    Dado que tenho um id de pedido gerado
    E tenho um id de item gerado
    Quando eu criar um pedido com o id fornecido e 2 unidades do item com preço de 25.0
    Então o pedido deve ser criado com o id fornecido
    E o pedido deve ser uma instância de Order

  Cenário: Gerar uuid automaticamente quando id não é fornecido
    Dado que tenho um id de item gerado
    Quando eu criar um pedido sem fornecer um id com 1 unidade do item com preço de 50.0
    Então o pedido deve ter um id definido
    E o id deve ser um uuid válido no formato v4

  Cenário: Definir status padrão como PENDING
    Dado que tenho um id de item gerado
    Quando eu criar um pedido sem especificar o status com 1 unidade do item com preço de 25.0
    Então o status do pedido deve ser "PENDING"

  Cenário: Usar status fornecido
    Dado que tenho um id de item gerado
    Quando eu criar um pedido com status "RECEIVED" e 1 unidade do item com preço de 25.0
    Então o status do pedido deve ser "RECEIVED"

  Cenário: Definir datas de criação e atualização automaticamente
    Dado que tenho um id de item gerado
    Quando eu criar um pedido sem fornecer datas com 1 unidade do item com preço de 25.0
    Então o pedido deve ter createdAt definido
    E o pedido deve ter updatedAt definido
    E as datas devem ser a data/hora atual

  Cenário: Usar datas fornecidas
    Dado que tenho um id de item gerado
    E tenho uma data de criação "2025-01-01T10:00:00Z"
    E tenho uma data de atualização "2025-01-01T11:00:00Z"
    Quando eu criar um pedido com as datas fornecidas e 1 unidade do item com preço de 25.0
    Então o pedido deve ter createdAt igual a "2025-01-01T10:00:00Z"
    E o pedido deve ter updatedAt igual a "2025-01-01T11:00:00Z"

  Cenário: Definir customerId quando fornecido
    Dado que tenho um id de item gerado
    E tenho um id de cliente gerado
    Quando eu criar um pedido com o customerId fornecido e 1 unidade do item com preço de 25.0
    Então o pedido deve ter o customerId definido

  Cenário: Criar pedido sem customerId
    Dado que tenho um id de item gerado
    Quando eu criar um pedido sem fornecer customerId com 1 unidade do item com preço de 25.0
    Então o pedido não deve ter customerId definido

  Cenário: Criar orderItems com orderId correto
    Dado que tenho um id de pedido gerado
    E tenho um id de item gerado
    Quando eu criar um pedido com o id fornecido e 2 unidades do item com preço de 25.0
    Então o pedido deve ter 1 item
    E o item deve ter o orderId correto
    E o item deve ter o itemId correto

  Cenário: Criar pedido com múltiplos itens
    Dado que tenho 3 ids de itens gerados
    Quando eu criar um pedido com:
      | itemId | quantidade | preço |
      | item1  | 2          | 25.0  |
      | item2  | 1          | 50.0  |
      | item3  | 3          | 15.0  |
    Então o pedido deve ter 3 itens
    E os itens devem ter os itemIds corretos

  Cenário: Calcular valor total corretamente para item único
    Dado que tenho um id de item gerado
    Quando eu criar um pedido com 2 unidades do item com preço de 25.0
    Então o valor total do pedido deve ser 50.0

  Cenário: Calcular valor total corretamente para múltiplos itens
    Dado que tenho 3 ids de itens gerados
    Quando eu criar um pedido com:
      | itemId | quantidade | preço |
      | item1  | 2          | 25.0  |
      | item2  | 1          | 50.0  |
      | item3  | 3          | 10.0  |
    Então o valor total do pedido deve ser 130.0

  Cenário: Erro ao criar pedido sem itens
    Quando eu tentar criar um pedido com lista de itens vazia
    Então deve lançar erro "No order items provided"

  Cenário: Erro ao criar pedido com item sem preço
    Dado que tenho um id de item gerado
    Quando eu tentar criar um pedido com 2 unidades do item com preço 0
    Então deve lançar erro "Invalid item price or quantity"

  Cenário: Erro ao criar pedido com item sem quantidade
    Dado que tenho um id de item gerado
    Quando eu tentar criar um pedido com 0 unidades do item com preço de 25.0
    Então deve lançar erro "Invalid item price or quantity"

  Cenário: Lidar com preços decimais corretamente
    Dado que tenho um id de item gerado
    Quando eu criar um pedido com 3 unidades do item com preço de 19.99
    Então o valor total do pedido deve ser 59.97

  Cenário: Arredondar valor total corretamente
    Dado que tenho 2 ids de itens gerados
    Quando eu criar um pedido com:
      | itemId | quantidade | preço |
      | item1  | 3          | 10.33 |
      | item2  | 2          | 5.55  |
    Então o valor total do pedido deve ser 42.09

  Cenário: Atualizar status de PENDING para RECEIVED
    Dado que tenho um pedido com status "PENDING"
    Quando eu atualizar o status para "RECEIVED"
    Então o status do pedido deve ser "RECEIVED"

  Cenário: Atualizar status de RECEIVED para PREPARING
    Dado que tenho um pedido com status "RECEIVED"
    Quando eu atualizar o status para "PREPARING"
    Então o status do pedido deve ser "PREPARING"

  Cenário: Atualizar status de PREPARING para READY
    Dado que tenho um pedido com status "PREPARING"
    Quando eu atualizar o status para "READY"
    Então o status do pedido deve ser "READY"

  Cenário: Atualizar status de READY para COMPLETED
    Dado que tenho um pedido com status "READY"
    Quando eu atualizar o status para "COMPLETED"
    Então o status do pedido deve ser "COMPLETED"

  Cenário: Atualizar updatedAt ao mudar status
    Dado que tenho um pedido com status "PENDING"
    E o pedido tem updatedAt definido como "2025-01-01T10:00:00Z"
    Quando eu atualizar o status para "RECEIVED"
    Então o updatedAt do pedido deve ser atualizado
    E o updatedAt deve ser diferente da data inicial

  Cenário: Permitir cancelamento de pedido em qualquer status
    Dado que tenho um pedido com status "PENDING"
    Quando eu atualizar o status para "CANCELLED"
    Então o status do pedido deve ser "CANCELLED"

  Cenário: Erro ao alterar status de pedido completado
    Dado que tenho um pedido com status "COMPLETED"
    Quando eu tentar atualizar o status para "PENDING"
    Então deve lançar BaseException com mensagem "Cannot change status of a completed or cancelled order"

  Cenário: Erro ao alterar status de pedido cancelado
    Dado que tenho um pedido com status "CANCELLED"
    Quando eu tentar atualizar o status para "PENDING"
    Então deve lançar BaseException com mensagem "Cannot change status of a completed or cancelled order"

  Cenário: Erro ao definir o mesmo status
    Dado que tenho um pedido com status "PENDING"
    Quando eu tentar atualizar o status para "PENDING"
    Então deve lançar BaseException com mensagem "Order status is already set to this value"

  Cenário: Erro ao pular status na sequência
    Dado que tenho um pedido com status "PENDING"
    Quando eu tentar atualizar o status para "PREPARING"
    Então deve lançar BaseException com mensagem "Order status must follow the defined sequence"

  Cenário: Erro ao retroceder na sequência de status
    Dado que tenho um pedido com status "PREPARING"
    Quando eu tentar atualizar o status para "PENDING"
    Então deve lançar BaseException com mensagem "Order status must follow the defined sequence"

  Cenário: Erro com mensagem de próximo status correto
    Dado que tenho um pedido com status "PENDING"
    Quando eu tentar atualizar o status para "READY"
    Então deve lançar erro com mensagem "Next status must be RECEIVED"

  Cenário: Seguir sequência completa de status
    Dado que tenho um pedido com status "PENDING"
    Quando eu atualizar o status para "RECEIVED"
    Então o status do pedido deve ser "RECEIVED"
    Quando eu atualizar o status para "PREPARING"
    Então o status do pedido deve ser "PREPARING"
    Quando eu atualizar o status para "READY"
    Então o status do pedido deve ser "READY"
    Quando eu atualizar o status para "COMPLETED"
    Então o status do pedido deve ser "COMPLETED"
