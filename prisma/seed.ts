import {
  PrismaClient,
  OrderStatus,
} from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
  // Limpar banco de dados (opcional, mas útil para desenvolvimento)
  await cleanDatabase();


  // Criar pedidos com pagamentos
  // Pedido 1
  const order1 = await prisma.order.create({
    data: {
      status: OrderStatus.COMPLETED,
      totalAmount: 59.7,
      customerId: "1f228665-4e55-4f0c-9537-da3ea7980511",
      createdAt: new Date('2025-08-01T09:30:40Z'),
    },
  });

  // Adicionar itens ao pedido 1
  await prisma.orderItem.create({
    data: {
      itemId: "a9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order1.id,
      quantity: 1,
      price: 22.9,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "b9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order1.id,
      quantity: 1,
      price: 18.9,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "c9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order1.id,
      quantity: 1,
      price: 7.9,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "d9f43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order1.id,
      quantity: 1,
      price: 10.0,
    },
  });

  // Pedido 2
  const order2 = await prisma.order.create({
    data: {
      status: OrderStatus.READY,
      totalAmount: 145.43,
      customerId: "2f228665-4e55-4f0c-9537-da3ea7980512",
      createdAt: new Date('2025-08-01T10:29:40Z'),
    },
  });

  // Adicionar itens ao pedido 2
  await prisma.orderItem.create({
    data: {
      itemId: "a9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order2.id,
      quantity: 2,
      price: 59.8,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "f9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order2.id,
      quantity: 1,
      price: 9.9,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "e9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order2.id,
      quantity: 1,
      price: 15.90,
    },
  });

  // Pedido 3
  const order3 = await prisma.order.create({
    data: {
      status: OrderStatus.RECEIVED,
      totalAmount: 41.8,
      customerId: "3f228665-4e55-4f0c-9537-da3ea7980513",
      createdAt: new Date('2025-08-01T10:20:40Z'),
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "e9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order3.id,
      quantity: 2,
      price: 15.90,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "87ded4c3-cec4-4a0f-8436-63bb677e3deb",
      orderId: order3.id,
      quantity: 3,
      price: 5.90,
    },
  });



  // Adicionar itens ao pedido 3
  await prisma.orderItem.create({
    data: {
      itemId: "g9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order3.id,
      quantity: 1,
      price: 24.9,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "f9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order3.id,
      quantity: 1,
      price: 9.9,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "h9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order3.id,
      quantity: 1,
      price: 7.0,
    },
  });
  


  // Pedido 4
  const order4 = await prisma.order.create({
    data: {
      status: OrderStatus.READY,
      totalAmount: 298.80,
      customerId: "2f228665-4e55-4f0c-9537-da3ea7980512",
      createdAt: new Date('2025-08-01T10:35:40Z'),
    },
  });

  // Adicionar itens ao pedido 4
  await prisma.orderItem.create({
    data: {
      itemId: "94961b05-c092-47ca-9e1b-2671584a7248",
      orderId: order4.id,
      quantity: 4,
      price: 59.8,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "f9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order4.id,
      quantity: 4,
      price: 9.9,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "d9f7529f-acbe-4ff2-a89f-e673d37e8521",
      orderId: order4.id,
      quantity: 4,
      price: 13.90,
    },
  });

  // Pedido 5
  const order5 = await prisma.order.create({
    data: {
      status: OrderStatus.READY,
      totalAmount: 209.00,
      customerId: "3f228665-4e55-4f0c-9537-da3ea7980513",
      createdAt: new Date('2025-08-01T10:31:40Z'),
    },
  });

  // Adicionar itens ao pedido 5
  await prisma.orderItem.create({
    data: {
      itemId: "g9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order5.id,
      quantity: 5,
      price: 24.9,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "f9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order5.id,
      quantity: 5,
      price: 9.9,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "h9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order5.id,
      quantity: 5,
      price: 7.0,
    },
  });
  // Pedido 6
  const order6 = await prisma.order.create({
    data: {
      status: OrderStatus.PREPARING,
      totalAmount: 36.90,
      customerId: "2f228665-4e55-4f0c-9537-da3ea7980512",
      createdAt: new Date('2025-08-01T10:22:40Z'),
    },
  });

  // Adicionar itens ao pedido 6
  await prisma.orderItem.create({
    data: {
      itemId: "d9f7529f-acbe-4ff2-a89f-e673d37e8521",
      orderId: order6.id,
      quantity: 4,
      price: 13.90,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "f9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order6.id,
      quantity: 1,
      price: 9.90,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "h9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order6.id,
      quantity: 1,
      price: 7.0,
    },
  });

  // Pedido 7
  const order7 = await prisma.order.create({
    data: {
      status: OrderStatus.PREPARING,
      totalAmount: 51.60,
      customerId: "1f228665-4e55-4f0c-9537-da3ea7980511",
      createdAt: new Date('2025-08-01T10:23:40Z'),
    },
  });

  // Adicionar itens ao pedido 7
  await prisma.orderItem.create({
    data: {
      itemId: "e9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order7.id,
      quantity: 1,
      price: 15.90,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "f9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order7.id,
      quantity: 1,
      price: 9.90,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "d9f43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order7.id,
      quantity: 2,
      price: 12.90,
    },
  });

  // Pedido 8
  const order8 = await prisma.order.create({
    data: {
      status: OrderStatus.RECEIVED,
      totalAmount: 65.70,
      customerId: "1f228665-4e55-4f0c-9537-da3ea7980511",
      createdAt: new Date('2025-08-01T10:40:40Z'),
    },
  });

  // Adicionar itens ao pedido 8
  await prisma.orderItem.create({
    data: {
      itemId: "g9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order8.id,
      quantity: 1,
      price: 24.90,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "f9d43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order8.id,
      quantity: 2,
      price: 9.90,
    },
  });

  await prisma.orderItem.create({
    data: {
      itemId: "d9f43512-bfcc-4592-bb42-1e2f630f29a0",
      orderId: order8.id,
      quantity: 3,
      price: 7.00,
    },
  });


  console.log('Seed executado com sucesso!');
}

// Função para limpar o banco antes de inserir novos dados
async function cleanDatabase() {
  // A ordem é importante devido às chaves estrangeiras
  //await prisma.payment.deleteMany({});
  //await prisma.customer.deleteMany({});
  await prisma.orderItem.deleteMany({});
  //await prisma.item.deleteMany({});
  //await prisma.internalUser.deleteMany({});
  //await prisma.role.deleteMany({});
  await prisma.order.deleteMany({});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
