import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AppModule } from 'src/app.module';

import { User } from 'src/user/entities/user.entity';
import { Network } from 'src/network/entities/network.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeNetwork } from 'src/employee-network/entities/employee-network.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { ExpenseType } from 'src/expense_type/entities/expense_type.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Point } from 'src/point/entities/point.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Alert } from 'src/alert/entities/alert.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Product } from 'src/product/entities/product.entity';
import { Sold } from 'src/sold/entities/sold.entity';

import { Role } from 'src/shared/enums/role.enum';
import { ServiceType } from 'src/shared/enums/service_type.enum';

const COUNT = 20;
const USER_COUNT = 2;

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  const userRepository = dataSource.getRepository(User);
  const networkRepository = dataSource.getRepository(Network);
  const employeeRepository = dataSource.getRepository(Employee);
  const employeeNetworkRepository = dataSource.getRepository(EmployeeNetwork);
  const customerRepository = dataSource.getRepository(Customer);
  const expenseTypeRepository = dataSource.getRepository(ExpenseType);
  const planRepository = dataSource.getRepository(Plan);
  const pointRepository = dataSource.getRepository(Point);
  const subscriptionRepository = dataSource.getRepository(Subscription);
  const paymentRepository = dataSource.getRepository(Payment);
  const alertRepository = dataSource.getRepository(Alert);
  const expenseRepository = dataSource.getRepository(Expense);
  const productRepository = dataSource.getRepository(Product);
  const soldRepository = dataSource.getRepository(Sold);

  try {
    console.log('======================================');
    console.log('🌱 Starting database seed...');
    console.log(
      `📦 Creating ${COUNT} records for each entity and ${USER_COUNT} users`,
    );
    console.log('======================================');

    // =========================================================
    // 1. USERS
    // =========================================================

    console.log('\n👤 Creating Users...');

    const users: User[] = [];

    const passwordHash = await bcrypt.hash('Password@123456', 10);

    for (let i = 1; i <= USER_COUNT; i++) {
      const email = `user${i}@example.com`;

      let user = await userRepository.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        user = userRepository.create({
          name: `Demo User ${i}`,
          description: `Demo user number ${i}`,
          email,
          password: passwordHash,
          phone: `+966500000${String(i).padStart(3, '0')}`,
          address: `Riyadh, Saudi Arabia - Street ${i}`,
          role: i === 1 ? Role.ADMIN : Role.USER,
          active: true,
        });

        user = await userRepository.save(user);
      }

      users.push(user);
    }

    console.log(`✅ Users: ${users.length}`);

    // =========================================================
    // 2. NETWORKS
    // =========================================================

    console.log('\n🌐 Creating Networks...');

    const networks: Network[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const owner = users[(i - 1) % users.length];

      let network = await networkRepository.findOne({
        where: {
          name: `Demo Network ${i}`,
          user_id: owner.id,
        },
      });

      if (!network) {
        network = networkRepository.create({
          name: `Demo Network ${i}`,
          user_id: owner.id,
          active: true,
        });

        network = await networkRepository.save(network);
      }

      networks.push(network);
    }

    console.log(`✅ Networks: ${networks.length}`);

    // =========================================================
    // 3. EMPLOYEES
    // =========================================================

    console.log('\n👨‍💼 Creating Employees...');

    const employees: Employee[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const owner = users[(i - 1) % users.length];

      const email = `employee${i}@example.com`;

      let employee = await employeeRepository.findOne({
        where: {
          email,
        },
      });

      if (!employee) {
        employee = employeeRepository.create({
          email,
          full_name: `Demo Employee ${i}`,
          password: passwordHash,
          user_id: owner.id,
          active: true,
        });

        employee = await employeeRepository.save(employee);
      }

      employees.push(employee);
    }

    console.log(`✅ Employees: ${employees.length}`);

    // =========================================================
    // 4. EMPLOYEE NETWORK
    // =========================================================

    console.log('\n🔗 Creating Employee Networks...');

    const employeeNetworks: EmployeeNetwork[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const employee = employees[i - 1];
      const network = networks[i - 1];
      const owner = users[(i - 1) % users.length];

      if (!employee) {
        throw new Error(`Employee ${i} is undefined`);
      }

      if (!network) {
        throw new Error(`Network ${i} is undefined`);
      }

      if (!owner) {
        throw new Error(`User owner for index ${i} is undefined`);
      }

      let employeeNetwork = await employeeNetworkRepository.findOne({
        where: {
          employee_id: employee.id,
          network_id: network.id,
        },
      });

      if (!employeeNetwork) {
        employeeNetwork = employeeNetworkRepository.create({
          employee_id: employee.id,
          network_id: network.id,
          user_id: owner.id,
          active: true,
        });

        employeeNetwork = await employeeNetworkRepository.save(employeeNetwork);
      }

      employeeNetworks.push(employeeNetwork);
    }

    console.log(`✅ Employee Networks: ${employeeNetworks.length}`);
    // =========================================================
    // 5. EXPENSE TYPES
    // =========================================================

    console.log('\n💰 Creating Expense Types...');

    const expenseTypes: ExpenseType[] = [];

    const expenseNames = [
      'Internet',
      'Maintenance',
      'Electricity',
      'Rent',
      'Transportation',
      'Equipment',
      'Software',
      'Server',
      'Marketing',
      'Office',
      'Fuel',
      'Installation',
      'Repair',
      'Security',
      'Support',
      'Cleaning',
      'Telephone',
      'Hosting',
      'Hardware',
      'Other',
    ];

    for (let i = 1; i <= COUNT; i++) {
      const owner = users[(i - 1) % users.length];

      const name = expenseNames[i - 1];

      let expenseType = await expenseTypeRepository.findOne({
        where: {
          name,
          user_id: owner.id,
        },
      });

      if (!expenseType) {
        expenseType = expenseTypeRepository.create({
          name,
          user_id: owner.id,
          active: true,
        });

        expenseType = await expenseTypeRepository.save(expenseType);
      }

      expenseTypes.push(expenseType);
    }

    console.log(`✅ Expense Types: ${expenseTypes.length}`);

    // =========================================================
    // 6. CUSTOMERS
    // =========================================================

    console.log('\n👥 Creating Customers...');

    const customers: Customer[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const owner = users[(i - 1) % users.length];
      const network = networks[(i - 1) % networks.length];

      const phone = `+966511000${String(i).padStart(4, '0')}`;

      let customer = await customerRepository.findOne({
        where: {
          phone,
        },
      });

      if (!customer) {
        customer = customerRepository.create({
          name: `Customer ${i}`,
          phone,
          network_id: network.id,
          user_id: owner.id,
          active: true,
        });

        customer = await customerRepository.save(customer);
      }

      customers.push(customer);
    }

    console.log(`✅ Customers: ${customers.length}`);

    // =========================================================
    // 7. PLANS
    // =========================================================

    console.log('\n📡 Creating Plans...');

    const plans: Plan[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const owner = users[(i - 1) % users.length];
      const network = networks[(i - 1) % networks.length];

      const name = `Internet Plan ${i}`;

      let plan = await planRepository.findOne({
        where: {
          name,
          network_id: network.id,
        },
      });

      if (!plan) {
        plan = planRepository.create({
          name,
          price: 50 + i * 10,
          network_id: network.id,
          user_id: owner.id,

          service_type: ServiceType.PPPOE,

          download_speed: 20 + i * 5,
          upload_speed: 5 + i,

          quota_mb: 50000 + i * 10000,

          session_timeout: 0,

          validity_days: 30,

          simultaneous_use: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1,

          active: true,
        });

        plan = await planRepository.save(plan);
      }

      plans.push(plan);
    }

    console.log(`✅ Plans: ${plans.length}`);

    // =========================================================
    // 8. POINTS
    // =========================================================

    console.log('\n📍 Creating Points...');

    const points: Point[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const owner = users[(i - 1) % users.length];
      const network = networks[(i - 1) % networks.length];

      const name = `Network Point ${i}`;

      let point = await pointRepository.findOne({
        where: {
          name,
          network_id: network.id,
        },
      });

      if (!point) {
        point = pointRepository.create({
          name,

          network_id: network.id,

          user_id: owner.id,

          max_subscription: 50 + i * 5,

          count_subscription: 0,

          notes: `Demo point number ${i}`,

          location: {
            latitude: 24.7136 + i * 0.01,
            longitude: 46.6753 + i * 0.01,
          },

          active: true,
        });

        point = await pointRepository.save(point);
      }

      points.push(point);
    }

    console.log(`✅ Points: ${points.length}`);

    // =========================================================
    // 9. SUBSCRIPTIONS
    // =========================================================

    console.log('\n📋 Creating Subscriptions...');

    const subscriptions: Subscription[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const owner = users[(i - 1) % users.length];

      const customer = customers[(i - 1) % customers.length];

      const plan = plans[(i - 1) % plans.length];

      const point = points[(i - 1) % points.length];

      const network = networks[(i - 1) % networks.length];

      let subscription = await subscriptionRepository.findOne({
        where: {
          customer_id: customer.id,
          plan_id: plan.id,
        },
      });

      if (!subscription) {
        subscription = subscriptionRepository.create({
          customer_id: customer.id,

          plan_id: plan.id,

          point_id: point.id,

          network_id: network.id,

          radius_username: `demo_user_${i}`,

          user_id: owner.id,

          location: {
            latitude: 24.7136 + i * 0.01,
            longitude: 46.6753 + i * 0.01,
          },

          active: true,
        });

        subscription = await subscriptionRepository.save(subscription);
      }

      subscriptions.push(subscription);
    }

    console.log(`✅ Subscriptions: ${subscriptions.length}`);

    // =========================================================
    // 10. PAYMENTS
    // =========================================================

    console.log('\n💳 Creating Payments...');

    const payments: Payment[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const subscription = subscriptions[i - 1];

      const owner = users[(i - 1) % users.length];

      const network = networks[(i - 1) % networks.length];

      let payment = await paymentRepository.findOne({
        where: {
          subscription_id: subscription.id,
        },
      });

      if (!payment) {
        payment = paymentRepository.create({
          subscription_id: subscription.id,

          amount: 50 + i * 10,

          network_id: network.id,

          user_id: owner.id,

          active: true,
        });

        payment = await paymentRepository.save(payment);
      }

      payments.push(payment);
    }

    console.log(`✅ Payments: ${payments.length}`);

    // =========================================================
    // 11. ALERTS
    // =========================================================

    console.log('\n🚨 Creating Alerts...');

    const alerts: Alert[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const subscription = subscriptions[i - 1];

      const owner = users[(i - 1) % users.length];

      let alert = await alertRepository.findOne({
        where: {
          subscription_id: subscription.id,
        },
      });

      if (!alert) {
        alert = alertRepository.create({
          subscription_id: subscription.id,

          user_id: owner.id,

          active: true,
        });

        alert = await alertRepository.save(alert);
      }

      alerts.push(alert);
    }

    console.log(`✅ Alerts: ${alerts.length}`);

    // =========================================================
    // 12. EXPENSES
    // =========================================================

    console.log('\n💸 Creating Expenses...');

    const expenses: Expense[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const owner = users[(i - 1) % users.length];

      const network = networks[(i - 1) % networks.length];

      const employee = employees[(i - 1) % employees.length];

      const expenseType = expenseTypes[(i - 1) % expenseTypes.length];

      let expense = await expenseRepository.findOne({
        where: {
          network_id: network.id,
          expense_type_id: expenseType.id,
          employee_id: employee.id,
        },
      });

      if (!expense) {
        expense = expenseRepository.create({
          value: 100 + i * 25,

          expense_type_id: expenseType.id,

          network_id: network.id,

          employee_id: employee.id,

          user_id: owner.id,

          notes: `Demo expense number ${i}`,

          active: true,
        });

        expense = await expenseRepository.save(expense);
      }

      expenses.push(expense);
    }

    console.log(`✅ Expenses: ${expenses.length}`);

    // =========================================================
    // 13. PRODUCTS
    // =========================================================

    console.log('\n📦 Creating Products...');

    const products: Product[] = [];

    const productNames = [
      'TP-Link Router',
      'MikroTik Router',
      'Ubiquiti Access Point',
      'Network Switch',
      'Ethernet Cable',
      'Fiber Cable',
      'Power Adapter',
      'Network Rack',
      'ONT Device',
      'ONU Device',
      'WiFi Antenna',
      'Fiber Connector',
      'SFP Module',
      'Patch Panel',
      'UPS',
      'Network Cabinet',
      'Wireless Router',
      'Modem',
      'Access Point',
      'Network Card',
    ];

    for (let i = 1; i <= COUNT; i++) {
      const owner = users[(i - 1) % users.length];

      const name = productNames[i - 1];

      let product = await productRepository.findOne({
        where: {
          name,
          user_id: owner.id,
        },
      });

      if (!product) {
        product = productRepository.create({
          name,

          price: 50 + i * 20,

          user_id: owner.id,

          active: true,
        });

        product = await productRepository.save(product);
      }

      products.push(product);
    }

    console.log(`✅ Products: ${products.length}`);

    // =========================================================
    // 14. SOLD
    // =========================================================

    console.log('\n🛒 Creating Sales...');

    const sales: Sold[] = [];

    for (let i = 1; i <= COUNT; i++) {
      const product = products[i - 1];

      const owner = users[(i - 1) % users.length];

      const amount = (i % 5) + 1;

      const value = product.price * amount;

      let sale = await soldRepository.findOne({
        where: {
          product_id: product.id,

          user_id: owner.id,
        },
      });

      if (!sale) {
        sale = soldRepository.create({
          product_id: product.id,

          user_id: owner.id,

          amount,

          value,

          unit: 'piece',

          active: true,
        });

        sale = await soldRepository.save(sale);
      }

      sales.push(sale);
    }

    console.log(`✅ Sales: ${sales.length}`);

    // =========================================================
    // UPDATE POINT SUBSCRIPTION COUNTS
    // =========================================================

    console.log('\n🔄 Updating Point subscription counts...');

    for (const point of points) {
      const count = await subscriptionRepository.count({
        where: {
          point_id: point.id,
        },
      });

      await pointRepository.update(point.id, {
        count_subscription: count,
      });
    }

    // =========================================================
    // SUMMARY
    // =========================================================

    console.log('\n======================================');
    console.log('🌱 DATABASE SEED COMPLETED');
    console.log('======================================');

    console.log(`👤 Users:              ${users.length}`);
    console.log(`🌐 Networks:           ${networks.length}`);
    console.log(`👨‍💼 Employees:         ${employees.length}`);
    console.log(`🔗 Employee Networks:  ${employeeNetworks.length}`);
    console.log(`💰 Expense Types:      ${expenseTypes.length}`);
    console.log(`👥 Customers:          ${customers.length}`);
    console.log(`📡 Plans:              ${plans.length}`);
    console.log(`📍 Points:             ${points.length}`);
    console.log(`📋 Subscriptions:      ${subscriptions.length}`);
    console.log(`💳 Payments:           ${payments.length}`);
    console.log(`🚨 Alerts:             ${alerts.length}`);
    console.log(`💸 Expenses:           ${expenses.length}`);
    console.log(`📦 Products:           ${products.length}`);
    console.log(`🛒 Sales:              ${sales.length}`);

    console.log('======================================');

    console.log('\n🔐 Login credentials:');

    console.log('\nAdmin:');
    console.log('Email: user1@example.com');
    console.log('Password: Password@123456');

    console.log('\nUsers:');
    console.log('Email: user2@example.com ... user3@example.com');
    console.log('Password: Password@123456');

    console.log('\nEmployees:');
    console.log('Email: employee1@example.com ... employee20@example.com');
    console.log('Password: Password@123456');

    console.log('\n======================================');
  } catch (error) {
    console.error('\n❌ Seed failed');
    console.error(error);

    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
